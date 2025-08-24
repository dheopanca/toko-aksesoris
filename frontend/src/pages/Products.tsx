import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { productApi } from "@/services/api";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

type SortOption = "price-low" | "price-high" | "newest" | "name-asc" | "name-desc";

interface FilterState {
  category: string | null;
  priceRange: [number, number];
  sort: SortOption;
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => productApi.getAll(),
  });

  // Cari harga minimum dan maksimum dari produk
  const prices = products.map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 5000;

  // State filter, default price range mengikuti data produk
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category"),
    priceRange: [minPrice, maxPrice],
    sort: "newest",
  });
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Update products when data changes or filters change
  useEffect(() => {
    if (products.length > 0) {
      let result = [...products];
      
      // Apply category filter
      if (filters.category) {
        result = result.filter((product) => 
          product.category === filters.category
        );
      }
      
      // Apply price filter
      result = result.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      );
      
      // Apply sort
      switch (filters.sort) {
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "newest":
        default:
          // Assuming createdAt is in ISO format string
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
      
      setFilteredProducts(result);
    }
  }, [products, filters]);
  
  useEffect(() => {
    // Update URL when category changes
    const params = new URLSearchParams();
    if (filters.category) {
      params.set("category", filters.category);
    }
    setSearchParams(params);
  }, [filters.category, setSearchParams]);
  
  // Update price range filter jika data produk berubah
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [minPrice, maxPrice],
    }));
    // eslint-disable-next-line
  }, [minPrice, maxPrice]);
  
  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === "all" ? null : category,
    }));
  };
  
  // Handle price filter change
  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }));
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: value as SortOption,
    }));
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">Failed to load products. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Collections</h1>
      
      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-between"
        >
          <span>Filters & Sort</span>
          {isMobileFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop (always visible) & Mobile (toggle visibility) */}
        <div className={`w-full lg:w-64 space-y-6 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              <Button
                variant={filters.category === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange("all")}
                className="mr-2 mb-2"
              >
                All
              </Button>
              {["rings", "necklaces", "earrings", "bracelets"].map((category) => (
                <Button
                  key={category}
                  variant={filters.category === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className="mr-2 mb-2 capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <Accordion type="single" collapsible defaultValue="price">
              <AccordionItem value="price" className="border-none">
                <AccordionTrigger className="py-0 hover:no-underline">
                  <span className="text-sm font-normal">
                    {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[minPrice, maxPrice]}
                      min={minPrice}
                      max={maxPrice}
                      step={100}
                      value={[filters.priceRange[0], filters.priceRange[1]]}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>{formatPrice(minPrice)}</span>
                      <span>{formatPrice(maxPrice)}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <Separator />
          
          <div className="lg:hidden">
            <h3 className="font-medium mb-3">Sort By</h3>
            <Select defaultValue="newest" onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="flex-1">
          {/* Sort - Desktop */}
          <div className="hidden lg:flex items-center justify-end mb-6">
            <span className="text-sm mr-3">Sort by:</span>
            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">No products found matching your filters.</p>
              <Button onClick={() => setFilters({ category: null, priceRange: [minPrice, maxPrice], sort: "newest" })}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
