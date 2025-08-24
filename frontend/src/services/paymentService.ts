import api from './api';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentResponse {
  success: boolean;
  data: {
    token: string;
    redirect_url: string;
  };
  message: string;
}

export interface PaymentStatus {
  orderId: string;
  status: string;
  amount: number;
  paymentType: string;
  transactionTime: string;
}

// Create payment token
export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await api.post('/payment/create-token', paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment creation error:', error);
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (orderId: string): Promise<PaymentStatus> => {
  try {
    const response = await api.get(`/payment/status/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error('Get payment status error:', error);
    throw error;
  }
};

// Cancel payment
export const cancelPayment = async (orderId: string): Promise<any> => {
  try {
    const response = await api.post(`/payment/cancel/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Cancel payment error:', error);
    throw error;
  }
};

// Initialize Midtrans Snap
export const initializeMidtransSnap = (token: string, onSuccess?: (result: any) => void, onError?: (error: any) => void) => {
  // Load Midtrans script dynamically
  const script = document.createElement('script');
  script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
  script.setAttribute('data-client-key', 'Mid-client-C4eTOAQQIL6FkjYL');
  
  script.onload = () => {
    // @ts-ignore - Midtrans global object
    if (window.snap) {
      // @ts-ignore
      window.snap.pay(token, {
        onSuccess: (result: any) => {
          console.log('Payment success:', result);
          if (onSuccess) onSuccess(result);
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
        },
        onError: (result: any) => {
          console.log('Payment error:', result);
          if (onError) onError(result);
        },
        onClose: () => {
          console.log('Customer closed the popup without finishing payment');
        }
      });
    }
  };
  
  script.onerror = () => {
    console.error('Failed to load Midtrans script');
    if (onError) onError(new Error('Failed to load payment gateway'));
  };
  
  document.head.appendChild(script);
};

// Payment helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${random}`;
};
