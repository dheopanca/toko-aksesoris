
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, Diamond } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Footer from "./Footer";

export function Layout() {
  const { user, isAuthenticated, checkIsAdmin } = useAuth();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAdmin = checkIsAdmin();

  // Add scroll listener to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight flex items-center"
          >
            <div className="flex items-center">
              <div className="mr-2 relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                  <Diamond className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-xl font-semibold text-amber-800 tracking-wider leading-tight">Permata Indah</span>
                <span className="text-xs text-amber-600 font-light tracking-widest">FINE JEWELRY</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              Koleksi
            </Link>
            <Link
              to="/faq"
              className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              FAQ
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="ghost" className="hover:text-amber-700">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-white">
                <div className="flex items-center py-4 mb-4">
                  <div className="mr-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                      <Diamond className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="font-playfair text-lg font-semibold text-amber-800">Permata Indah</span>
                  </div>
                </div>
                
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/"
                    className="text-lg font-medium hover:text-amber-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/products"
                    className="text-lg font-medium hover:text-amber-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Koleksi
                  </Link>
                  <Link
                    to="/faq"
                    className="text-lg font-medium hover:text-amber-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/cart"
                    className="text-lg font-medium hover:text-amber-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Keranjang ({totalItems})
                  </Link>
                  {isAuthenticated ? (
                    <Link
                      to="/profile"
                      className="text-lg font-medium hover:text-amber-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profil Saya
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-lg font-medium hover:text-amber-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/admin/login"
                        className="text-lg font-medium hover:text-amber-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Login
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
