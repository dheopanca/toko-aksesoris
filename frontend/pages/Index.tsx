import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
// Local assets for categories
import imgCincin from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.15.57_6330c226.jpg";
import imgKalung from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.16_629912e4.jpg";
import imgAnting from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.35_1b452722.jpg";
import imgGelang from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.52_fac63789.jpg";
import { ArrowRight, ImageOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, checkIsAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect admin users to admin panel
  useEffect(() => {
    if (user && checkIsAdmin()) {
      navigate("/admin/dashboard");
    }
  }, [user, checkIsAdmin, navigate]);
  
  // Pre-fetch categories to improve navigation performance
  useQuery({
    queryKey: ["products"],
    queryFn: () => productApi.getAll(),
    staleTime: 60000, // 1 minute
  });

  // State for hero image error
  const [heroImageError, setHeroImageError] = useState(false);

  // Category image error states
  const [categoryImageErrors, setCategoryImageErrors] = useState<Record<string, boolean>>({});

  // Banner image error state
  const [bannerImageError, setBannerImageError] = useState(false);

  // Handle category image error
  const handleCategoryImageError = (categoryName: string) => {
    setCategoryImageErrors(prev => ({
      ...prev,
      [categoryName]: true
    }));
  };

  // Categories data with fallback images (removed watches)
  const categories = [
    { name: "Cincin", image: imgCincin, path: "/products?category=rings" },
    { name: "Kalung", image: imgKalung, path: "/products?category=necklaces" },
    { name: "Anting", image: imgAnting, path: "/products?category=earrings" },
    { name: "Gelang", image: imgGelang, path: "/products?category=bracelets" },
  ];

  // Don't render anything if user is admin (redirecting)
  if (user && checkIsAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[85vh] flex items-center" style={{ 
        backgroundImage: heroImageError 
          ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')`
          : `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1617038260897-41a1f14a2ea7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')`,
        backgroundAttachment: "fixed"
      }}>
        <img 
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a2ea7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          onError={() => setHeroImageError(true)}
          className="hidden" // Hidden image for preloading/error checking
          alt=""
        />
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight mb-6">
              Keindahan Abadi, Keanggunan Tanpa Batas
            </h1>
            <p className="text-xl text-white mb-8 font-light">
              Temukan koleksi perhiasan eksklusif kami untuk setiap momen berharga dalam hidup Anda.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-gold-dark to-gold-DEFAULT text-white hover:from-gold-DEFAULT hover:to-gold-light shadow-md hover:shadow-lg">
                <Link to="/products">Belanja Sekarang</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/20 text-white border-white hover:bg-white/30">
                <Link to="/faq">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-center">Koleksi Pilihan</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Temukan berbagai koleksi perhiasan eksklusif kami mulai dari cincin, kalung, anting hingga gelang yang dirancang untuk melengkapi gaya Anda.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name}
              to={category.path}
              className="group relative overflow-hidden rounded-lg hover-lift elegant-shadow"
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
                    <span className="text-white text-sm mt-2 inline-flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Lihat Koleksi <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Banner Section */}
      <section className="py-24 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              {bannerImageError ? (
                <img 
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a2ea7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                  alt="Handcrafted Jewelry"
                  className="rounded-lg shadow-elegant"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Handcrafted Jewelry"
                  className="rounded-lg shadow-elegant"
                  onError={() => setBannerImageError(true)}
                />
              )}
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">Keahlian dalam Setiap Detail</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Setiap perhiasan Permata Indah dibuat dengan keahlian tinggi menggunakan bahan berkualitas terbaik. Kami berdedikasi untuk menghadirkan keindahan dan keanggunan dalam setiap karya kami, menjadikan setiap perhiasan sebagai simbol keabadian yang bisa dinikmati dari generasi ke generasi.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="bg-amber-300 rounded-full p-1 mr-3 mt-1"></span>
                  <span>Material berkualitas premium</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-300 rounded-full p-1 mr-3 mt-1"></span>
                  <span>Desain eksklusif dan elegan</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-300 rounded-full p-1 mr-3 mt-1"></span>
                  <span>Pengerjaan tangan oleh ahli perhiasan</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-amber-300 rounded-full p-1 mr-3 mt-1"></span>
                  <span>Garansi kualitas seumur hidup</span>
                </li>
              </ul>
              <Button asChild className="bg-gradient-to-r from-gold-dark to-gold-DEFAULT text-white hover:from-gold-DEFAULT hover:to-gold-light shadow-md hover:shadow-lg">
                <Link to="/products">Jelajahi Koleksi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;