const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Create payment token (protected route)
router.post('/create-token', authenticate, paymentController.createPaymentToken);

// Get payment status (protected route)
router.get('/status/:orderId', authenticate, paymentController.getPaymentStatus);

// Cancel payment (protected route)
router.post('/cancel/:orderId', authenticate, paymentController.cancelPayment);

// Payment notification from Midtrans (public route)
router.post('/notification', paymentController.handlePaymentNotification);

module.exports = router;
