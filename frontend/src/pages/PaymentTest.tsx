import React, { useState } from 'react';
import PaymentButton from '../components/PaymentButton';
import PaymentStatus from '../components/PaymentStatus';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const PaymentTest: React.FC = () => {
  const [customerData, setCustomerData] = useState({
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '081234567890'
  });
  const [amount, setAmount] = useState(1500000);
  const [orderId, setOrderId] = useState('');

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment Success:', result);
    // Extract order ID from result
    if (result.order_id) {
      setOrderId(result.order_id);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment Error:', error);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Payment Test - Midtrans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  placeholder="081234567890"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (IDR)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="1500000"
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-center">
            <PaymentButton
              amount={amount}
              customerName={customerData.name}
              customerEmail={customerData.email}
              customerPhone={customerData.phone}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full md:w-auto"
            />
          </div>

          {/* Payment Status */}
          {orderId && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
              <PaymentStatus 
                orderId={orderId}
                onStatusChange={(status) => console.log('Status changed:', status)}
              />
            </div>
          )}

          {/* Test Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🧪 Test Instructions:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Fill in customer information above</li>
              <li>• Click "Pay" button to test payment</li>
              <li>• Use test credit cards in sandbox mode</li>
              <li>• Check console for payment results</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTest;
