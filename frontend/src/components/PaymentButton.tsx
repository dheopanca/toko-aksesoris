import React, { useState } from 'react';
import { Button } from './ui/button';
import { createPayment, initializeMidtransSnap, generateOrderId, formatCurrency } from '../services/paymentService';
import { useToast } from '../hooks/use-toast';

interface PaymentButtonProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Generate unique order ID
      const orderId = generateOrderId();
      
      // Create payment token
      const paymentData = {
        orderId,
        amount,
        customerName,
        customerEmail,
        customerPhone
      };
      
      const response = await createPayment(paymentData);
      
      if (response.success) {
        // Initialize Midtrans Snap
        initializeMidtransSnap(
          response.data.token,
          (result) => {
            toast({
              title: "Payment Success!",
              description: `Order ${orderId} has been paid successfully.`,
            });
            if (onSuccess) onSuccess(result);
          },
          (error) => {
            toast({
              title: "Payment Failed",
              description: "There was an error processing your payment.",
              variant: "destructive",
            });
            if (onError) onError(error);
          }
        );
      } else {
        throw new Error(response.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
      size="lg"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          💳 Pay {formatCurrency(amount)}
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
