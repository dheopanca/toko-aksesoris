import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Eye, ImageOff } from "lucide-react";
// Local assets per category
import imgRings from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.15.57_6330c226.jpg";
import imgNecklaces from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.16_629912e4.jpg";
import imgEarrings from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.35_1b452722.jpg";
import imgBracelets from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.52_fac63789.jpg";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add products to your cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    addItem(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Category-specific asset images
  const getCategoryAssetImage = () => {
    switch (product.category) {
      case "rings":
        return imgBracelets;
      case "necklaces":
        return imgNecklaces;
      case "earrings":
        return imgRings;
      case "bracelets":
        return imgEarrings;
      default:
        return imgRings;
    }
  };

  // Decide final image to show
  const categoryImage = getCategoryAssetImage();
  const displayImage = product.category === 'rings'
    ? (product.name?.toLowerCase().includes('solitaire') ? imgRings : imgBracelets)
    : categoryImage;

  return (
    <div className="group hover-lift elegant-card">
      <Link 
        to={`/products/${product.id}`}
        className="block relative"
      >
        <div className="aspect-square w-full overflow-hidden relative">
          {imageError ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <img
                src={displayImage}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ) : (
            <img
              src={displayImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button 
              onClick={handleAddToCart} 
              className="flex-1 bg-white/90 backdrop-blur-sm text-black hover:bg-white/100 text-xs md:text-sm"
              disabled={product.stock === 0}
              size="sm"
            >
              <ShoppingCart className="mr-2 h-3 w-3 md:h-4 md:w-4" />
              Tambah
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="bg-white/90 backdrop-blur-sm text-black hover:bg-white/100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/products/${product.id}`);
              }}
            >
              <Eye className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            Sisa {product.stock}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Habis
          </div>
        )}
        <div className="flex flex-col space-y-1 p-4">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="text-lg font-semibold text-gold-DEFAULT">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
}
