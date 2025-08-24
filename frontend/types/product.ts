export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "rings" | "necklaces" | "earrings" | "bracelets";
  imageUrl: string;
  featured?: boolean;
  stock: number;
  createdAt: string;
}