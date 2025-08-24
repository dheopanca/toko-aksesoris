
import { Product } from "./product";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  province: string;
  phone: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  address: Address;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}
