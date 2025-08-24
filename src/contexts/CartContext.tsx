
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Only load cart from localStorage if user is authenticated
    if (isAuthenticated) {
      const savedCart = localStorage.getItem("jewelryCart");
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
        }
      }
    } else {
      // Clear cart if user is not authenticated
      setItems([]);
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    // Only save cart to localStorage if user is authenticated
    if (isAuthenticated) {
      localStorage.setItem("jewelryCart", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addItem = (product: Product, quantity = 1) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add products to your cart",
        variant: "destructive",
      });
      return;
    }
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(item => 
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (!isAuthenticated) return;
    
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    if (!isAuthenticated) return;
    
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };

  const clearCart = () => {
    if (!isAuthenticated) return;
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce(
    (total, { product, quantity }) => total + product.price * quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
