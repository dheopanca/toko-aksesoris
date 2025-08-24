import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

// Pages
import Home from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductsPage from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetail";
import FAQPage from "./pages/FAQ";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import AdminLoginPage from "./pages/AdminLogin";
import RegisterPage from "./pages/Register";
import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminProductsPage from "./pages/admin/Products";
import AdminOrdersPage from "./pages/admin/Orders";
import AdminSettingsPage from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rute untuk user biasa dengan Layout standar */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="cart" element={<CartPage />} />
                {/* Rute login/register yang mungkin perlu layout minimal atau tanpa layout */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                {/* Rute admin login bisa di luar layout utama */}
                {/* <Route path="admin/login" element={<AdminLoginPage />} /> */}

                {/* Protected routes (User) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Catch-all for routes within Layout not matched */}
                {/* Ini perlu di akhir grup Route dengan Layout */}
                {/* <Route path="*" element={<NotFound />} /> */}
              </Route>

              {/* Rute Admin dengan AdminLayout */}
              {/* PENTING: Pastikan AdminLoginPage tidak di dalam AdminRoute jika AdminRoute mengarah ke AdminLayout */}
              <Route path="/admin/login" element={<AdminLoginPage />} /> {/* Admin Login di luar AdminLayout */}
              
              {/* Rute admin yang dilindungi adminProtect dan menggunakan AdminLayout */}
              {/* AdminRoute di sini akan membungkus konten dengan AdminLayout secara otomatis */}
              {/* Jika AdminRoute tidak secara otomatis menambahkan AdminLayout, maka AdminLayout perlu ditambahkan secara manual di sini */}
              {/* Contoh jika AdminRoute HANYA untuk proteksi: */}
              {/*
              <Route element={<AdminRoute />}> 
                 <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
                 <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
                 // ... admin routes with manual AdminLayout ...
              </Route>
              */}
              {/* Contoh jika AdminRoute SUDAH menambahkan AdminLayout di dalamnya: */}
               <Route path="/admin" element={<AdminRoute />}> {/* AdminRoute yang diasumsikan sudah punya AdminLayout */} 
                 <Route path="dashboard" element={<AdminDashboardPage />} />
                 <Route path="products" element={<AdminProductsPage />} />
                 <Route path="orders" element={<AdminOrdersPage />} />
                 <Route path="settings" element={<AdminSettingsPage />} />
               </Route>

               {/* Catch-all for all other unmatched routes (termasuk di luar Layout) */}
               {/* Ini perlu di akhir semua grup Route */}
               <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
