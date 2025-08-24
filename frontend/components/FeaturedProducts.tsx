
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: () => productApi.getFeatured(),
  });

  useEffect(() => {
    if (data) {
      setFeaturedProducts(data);
    }
  }, [data]);

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

  return (
    <section className="container mx-auto px-4 py-24 bg-white">
      <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-center">Koleksi Unggulan</h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        Temukan perhiasan premium kami yang dirancang dengan cermat untuk memenuhi selera eksklusif Anda
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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
