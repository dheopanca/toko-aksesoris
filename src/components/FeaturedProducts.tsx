import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoryImageErrors, setCategoryImageErrors] = useState<{[key: string]: boolean}>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: () => productApi.getFeatured(),
  });

  useEffect(() => {
    if (data) {
      setFeaturedProducts(data);
    }
  }, [data]);

  const handleCategoryImageError = (categoryName: string) => {
    setCategoryImageErrors(prev => ({ ...prev, [categoryName]: true }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto border-4 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-lg">Memuat koleksi unggulan...</p>
        </div>
      </div>
    );
  }

  if (isError || featuredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Koleksi Unggulan</h2>
          <p className="text-gray-500 mb-8">
            Maaf, kami tidak dapat memuat koleksi unggulan saat ini. Silakan coba lagi nanti.
          </p>
          <Button asChild className="bg-gradient-to-r from-gold-dark to-gold-DEFAULT text-white hover:from-gold-DEFAULT hover:to-gold-light shadow-md hover:shadow-lg">
            <Link to="/products">Lihat Semua Produk</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categories = [
    { name: 'Cincin', path: '/products?category=rings', image: '/categories/rings.jpg' },
    { name: 'Kalung', path: '/products?category=necklaces', image: '/categories/necklaces.jpg' },
    { name: 'Anting', path: '/products?category=earrings', image: '/categories/earrings.jpg' },
    { name: 'Gelang', path: '/products?category=bracelets', image: '/categories/bracelets.jpg' },
  ];

  return (
    <section className="container mx-auto px-4 py-24 bg-white">
      <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-center">Koleksi Unggulan</h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        Temukan perhiasan premium kami yang dirancang dengan cermat untuk memenuhi selera eksklusif Anda
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.name}
            className="group relative overflow-hidden rounded-lg hover-lift elegant-shadow cursor-pointer"
            onClick={() => window.location.href = category.path}
          >
            <div className="aspect-square w-full overflow-hidden">
              <img 
                src={categoryImageErrors[category.name] ? "https://images.unsplash.com/photo-1617038260897-41a1f14a2ea7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" : category.image} 
                alt={category.name} 
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                onError={() => handleCategoryImageError(category.name)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-white text-xl font-playfair font-medium">{category.name}</h3>
                  <span className="text-white text-sm mt-2 inline-flex items-center transition-all duration-300">
                    Lihat Koleksi <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-16">
        <Button asChild className="px-8 bg-transparent text-gold-DEFAULT border border-gold-DEFAULT hover:bg-gold-DEFAULT hover:text-white transition-all duration-300">
          <Link to="/products">Lihat Semua Koleksi</Link>
        </Button>
      </div>
    </section>
  );
}
