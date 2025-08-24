
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageOff } from "lucide-react";
// Local assets per category
import imgRings from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.15.57_6330c226.jpg";
import imgNecklaces from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.16_629912e4.jpg";
import imgEarrings from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.35_1b452722.jpg";
import imgBracelets from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.52_fac63789.jpg";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  
  const productId = parseInt(id || "0");
  
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productApi.getById(productId),
    enabled: !!id && !isNaN(productId),
  });
  
  const handleQuantityChange = (value: string) => {
    setQuantity(parseInt(value, 10));
  };
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add products to your cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (product) {
      addItem(product, quantity);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Category-specific asset image
  const getCategoryAssetImage = (category?: string) => {
    switch (category) {
      case "rings":
        return imgRings;
      case "necklaces":
        return imgNecklaces;
      case "earrings":
        return imgEarrings;
      case "bracelets":
        return imgBracelets;
      default:
        return imgRings;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {imageError ? (
            <div className="aspect-square w-full relative">
              <img
                src={getCategoryAssetImage(product.category)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full">
                <ImageOff size={20} className="text-gray-500" />
              </div>
            </div>
          ) : (
            <img
              src={getCategoryAssetImage(product.category)}
              alt={product.name}
              className="w-full h-auto object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-6">
            {formatPrice(product.price)}
          </p>
          
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="flex gap-4 items-end">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <Select
                  defaultValue="1"
                  onValueChange={handleQuantityChange}
                  disabled={product.stock === 0}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Qty" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map(
                      (num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Button
                  className="w-full"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm">
                <span className="font-medium">Availability: </span>
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Category: </span>
                <span className="capitalize">{product.category}</span>
              </p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Product Details */}
          <div>
            <h3 className="font-medium mb-4">Product Details</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Premium quality materials</li>
              <li>Handcrafted with care</li>
              <li>Comes with a luxurious gift box</li>
              <li>1-year warranty against manufacturing defects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
