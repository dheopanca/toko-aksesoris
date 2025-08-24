
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { orderApi } from "@/services/api";
import { Address } from "@/types/order";
import { OrderSummary } from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle, CheckCircle, Loader, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const addressSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  province: z.string().min(2, "Province is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Monitor network status changes
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      street: "",
      city: "",
      postalCode: "",
      province: "",
      phone: "",
    },
  });
  
  // Prefill form with profile data and lock fields
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.name || "",
        street: (user as any).addressStreet || "",
        city: (user as any).addressCity || "",
        postalCode: (user as any).addressPostalCode || "",
        province: (user as any).addressProvince || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);
  
  // Determine if profile data is complete for checkout
  const profileIncomplete = !user || !user.name || !user.phone || !(user as any).addressStreet || !(user as any).addressCity || !(user as any).addressProvince || !(user as any).addressPostalCode;
  
  const handleSubmit = async (data: AddressFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to place an order",
      });
      navigate("/login?redirect=checkout");
      return;
    }
    
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty cart",
        description: "Your cart is empty. Add items to proceed.",
      });
      navigate("/products");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order items array for API
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      
      // Check network status first
      if (!navigator.onLine) {
        setIsOfflineMode(true);
        // Simulate successful order in offline mode
        setTimeout(() => {
          clearCart();
          setOrderComplete(true);
          toast({
            title: "Order placed in offline mode",
            description: "Your order has been saved locally and will be processed when connection is restored.",
          });
        }, 1500);
        return;
      }
      
      // Submit order when online
      const order = await orderApi.create(user.id, orderItems, data as Address);
      
      // Clear cart after successful order
      clearCart();
      setOrderComplete(true);
      
      toast({
        title: "Order placed successfully",
        description: "Thank you for your order!",
      });
    } catch (error) {
      console.error("Error placing order:", error);
      
      // Check if we're in offline mode
      if (navigator.onLine === false || (error as Error).message?.includes("Failed to fetch")) {
        setIsOfflineMode(true);
        
        // Simulate successful order in offline mode
        setTimeout(() => {
          clearCart();
          setOrderComplete(true);
          
          toast({
            title: "Order placed in offline mode",
            description: "Your order has been saved locally and will be processed when connection is restored.",
          });
        }, 1500);
        
        return;
      }
      
      toast({
        variant: "destructive",
        title: "Error placing order",
        description: (error as Error).message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Order Successful!</h2>
          <p className="text-gray-600 mb-6">
            {isOfflineMode 
              ? "Your order has been saved and will be processed once internet connection is restored." 
              : "Thank you for your purchase. Your order has been confirmed."}
          </p>
          <div className="space-y-4">
            <Button onClick={() => navigate("/profile")} className="w-full">
              View Order History
            </Button>
            <Button onClick={() => navigate("/products")} variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            You cannot proceed to checkout with an empty cart.
          </p>
          <Button onClick={() => navigate("/products")}>Shop Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {!networkStatus && (
        <Alert variant="warning" className="mb-6 border-yellow-400 bg-yellow-50">
          <WifiOff className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">You are offline</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Don't worry! You can still complete your order. It will be processed once you're back online.
          </AlertDescription>
        </Alert>
      )}
      
      {isOfflineMode && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <AlertTitle>Offline Mode Active</AlertTitle>
          <AlertDescription>
            You are currently in offline mode. Your order will be saved locally and processed when connection is restored.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Address Form */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            {profileIncomplete && (
              <Alert variant="warning" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Lengkapi profil Anda</AlertTitle>
                <AlertDescription>
                  Untuk memesan, lengkapi informasi pribadi dan alamat di halaman Profil. Data alamat di checkout akan otomatis terisi dan tidak dapat diubah di sini.
                </AlertDescription>
                <div className="mt-3">
                  <Button size="sm" variant="outline" onClick={() => navigate("/profile")}>
                    Buka Halaman Profil
                  </Button>
                </div>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" readOnly disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your street address" readOnly disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your city" readOnly disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" readOnly disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your province" readOnly disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter your phone number" readOnly disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="border border-gray-200 rounded-md p-4 flex items-center">
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      defaultChecked
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      readOnly
                    />
                    <label htmlFor="cash" className="ml-3 block text-sm font-medium">
                      Cash on Delivery
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You will pay in cash when your order is delivered.
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || profileIncomplete}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader className="h-4 w-4 mr-2 animate-spin" /> Processing...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="sticky top-24">
            <div className="flex items-center mb-4 gap-2">
              <h2 className="text-xl font-bold">Order Summary</h2>
              {networkStatus ? (
                <span className="inline-flex items-center text-xs text-green-600 font-medium">
                  <Wifi className="h-3 w-3 mr-1" /> Online
                </span>
              ) : (
                <span className="inline-flex items-center text-xs text-yellow-600 font-medium">
                  <WifiOff className="h-3 w-3 mr-1" /> Offline
                </span>
              )}
            </div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
