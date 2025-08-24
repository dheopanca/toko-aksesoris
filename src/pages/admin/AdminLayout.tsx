
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Package,
  LogOut,
  Settings,
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, checkIsAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is admin
  useEffect(() => {
    if (!user || !checkIsAdmin()) {
      navigate("/admin/login");
    }
  }, [user, checkIsAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 bg-white shadow-lg flex-shrink-0 flex-col">
          <div className="flex items-center justify-center h-16 border-b">
            <span className="font-playfair text-xl font-bold text-amber-800">Admin Panel</span>
          </div>
          
          <div className="px-4 py-4 border-b">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheck className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <Link to="/admin/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start font-normal hover:bg-amber-50 hover:text-amber-700"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            
            <Link to="/admin/products">
              <Button
                variant="ghost"
                className="w-full justify-start font-normal hover:bg-amber-50 hover:text-amber-700"
              >
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            
            <Link to="/admin/orders">
              <Button
                variant="ghost"
                className="w-full justify-start font-normal hover:bg-amber-50 hover:text-amber-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Button>
            </Link>
            
            <Separator className="my-2" />
            
            <Button
              variant="ghost"
              className="w-full justify-start font-normal hover:bg-amber-50 hover:text-amber-700"
              asChild
            >
              <Link to="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start font-normal text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </nav>
        </aside>
        
        {/* Mobile Sidebar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-playfair text-lg font-bold text-amber-800">Admin Panel</span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
          <div className="flex overflow-x-auto px-2 py-2 border-t border-b">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm" className="flex flex-col items-center min-w-[70px]">
                <LayoutDashboard className="h-4 w-4 mb-1" />
                <span className="text-xs">Dashboard</span>
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm" className="flex flex-col items-center min-w-[70px]">
                <Package className="h-4 w-4 mb-1" />
                <span className="text-xs">Products</span>
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className="flex flex-col items-center min-w-[70px]">
                <ShoppingCart className="h-4 w-4 mb-1" />
                <span className="text-xs">Orders</span>
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="ghost" size="sm" className="flex flex-col items-center min-w-[70px]">
                <Settings className="h-4 w-4 mb-1" />
                <span className="text-xs">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <div className="p-6 md:px-8 pb-24 md:py-8 md:pb-8 mt-16 md:mt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
