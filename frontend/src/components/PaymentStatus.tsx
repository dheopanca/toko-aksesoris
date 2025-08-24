import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { getPaymentStatus, cancelPayment, formatCurrency } from '../services/paymentService';
import { useToast } from '../hooks/use-toast';

interface PaymentStatusProps {
  orderId: string;
  onStatusChange?: (status: string) => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ orderId, onStatusChange }) => {
  const [status, setStatus] = useState<string>('loading');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentStatus();
  }, [orderId]);

  const fetchPaymentStatus = async () => {
    try {
      const data = await getPaymentStatus(orderId);
      setStatus(data.status);
      setPaymentData(data);
      if (onStatusChange) onStatusChange(data.status);
    } catch (error) {
      console.error('Failed to fetch payment status:', error);
      setStatus('error');
    }
  };

  const handleCancelPayment = async () => {
    try {
      setIsLoading(true);
      await cancelPayment(orderId);
      toast({
        title: "Payment Cancelled",
        description: "Your payment has been cancelled successfully.",
      });
      fetchPaymentStatus(); // Refresh status
    } catch (error) {
      console.error('Failed to cancel payment:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settlement':
      case 'capture':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancel':
      case 'deny':
      case 'expire':
        return 'bg-red-500';
      case 'challenge':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'settlement':
        return 'Paid';
      case 'capture':
        return 'Captured';
      case 'pending':
        return 'Pending';
      case 'cancel':
        return 'Cancelled';
      case 'deny':
        return 'Denied';
      case 'expire':
        return 'Expired';
      case 'challenge':
        return 'Under Review';
      default:
        return status;
    }
  };

  if (status === 'loading') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Failed to load payment status
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Payment Status
          <Badge className={getStatusColor(status)}>
            {getStatusText(status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentData && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Order ID</label>
                <p className="text-sm">{paymentData.orderId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Amount</label>
                <p className="text-sm font-semibold">{formatCurrency(paymentData.amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Type</label>
                <p className="text-sm">{paymentData.paymentType || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Transaction Time</label>
                <p className="text-sm">{new Date(paymentData.transactionTime).toLocaleString('id-ID')}</p>
              </div>
            </div>

            {status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  onClick={handleCancelPayment}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? 'Cancelling...' : 'Cancel Payment'}
                </Button>
                <Button
                  onClick={fetchPaymentStatus}
                  variant="outline"
                  size="sm"
                >
                  Refresh Status
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
