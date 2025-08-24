const midtransClient = require('midtrans-client');
const crypto = require('crypto');
require('dotenv').config();

// Initialize Midtrans client
const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Create payment token
const createPaymentToken = async (req, res) => {
  try {
    const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone
      },
      item_details: [
        {
          id: "ITEM001",
          price: amount,
          quantity: 1,
          name: "Permata Indah Jewelry"
        }
      ]
    };

    const transaction = await snap.createTransaction(parameter);
    
    res.json({
      success: true,
      data: {
        token: transaction.token,
        redirect_url: transaction.redirect_url
      },
      message: "Payment token created successfully"
    });
  } catch (error) {
    console.error('Payment token creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment token',
      details: error.message
    });
  }
};

// Handle payment notification
const handlePaymentNotification = async (req, res) => {
  try {
    const notification = req.body;
    
    // Verify signature key
    const expectedSignature = crypto
      .createHash('sha512')
      .update(notification.order_id + notification.status_code + notification.gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest('hex');

    if (notification.signature_key !== expectedSignature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signature'
      });
    }

    // Process payment status
    const orderId = notification.order_id;
    const paymentStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let orderStatus = 'pending';

    if (paymentStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        orderStatus = 'challenge';
      } else if (fraudStatus === 'accept') {
        orderStatus = 'confirmed';
      }
    } else if (paymentStatus === 'settlement') {
      orderStatus = 'confirmed';
    } else if (paymentStatus === 'cancel' || paymentStatus === 'deny' || paymentStatus === 'expire') {
      orderStatus = 'cancelled';
    } else if (paymentStatus === 'pending') {
      orderStatus = 'pending';
    }

    // Update order status in database
    // Note: You'll need to implement this based on your existing order model
    console.log(`Order ${orderId} status updated to: ${orderStatus}`);

    res.json({
      success: true,
      message: 'Payment notification processed successfully'
    });
  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment notification'
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const transaction = await snap.transaction.status(orderId);
    
    res.json({
      success: true,
      data: {
        orderId: transaction.order_id,
        status: transaction.transaction_status,
        amount: transaction.gross_amount,
        paymentType: transaction.payment_type,
        transactionTime: transaction.transaction_time
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status'
    });
  }
};

// Cancel payment
const cancelPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const result = await snap.transaction.cancel(orderId);
    
    res.json({
      success: true,
      data: result,
      message: 'Payment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel payment'
    });
  }
};

module.exports = {
  createPaymentToken,
  handlePaymentNotification,
  getPaymentStatus,
  cancelPayment
};
