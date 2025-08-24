
import { useCart } from "@/contexts/CartContext";

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
  className?: string;
}

export function OrderSummary({ showCheckoutButton = false, className = "" }: OrderSummaryProps) {
  const { items, subtotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-2">Your cart is empty</div>
        )}
      </div>
      
      <div className="border-t border-gray-200 my-4 pt-4">
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-4 pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
      
      {showCheckoutButton && items.length > 0 && (
        <a
          href="/checkout"
          className="mt-6 block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Checkout
        </a>
      )}
    </div>
  );
}
