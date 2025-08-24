import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { authApi, userApi } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  addressStreet?: string;
  addressCity?: string;
  addressProvince?: string;
  addressPostalCode?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  checkIsAdmin: () => boolean;
  updateUserProfile: (name: string, phone?: string, address?: { street?: string; city?: string; province?: string; postalCode?: string }) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = Cookies.get('auth_token');
        
        if (token) {
          try {
            // Fetch current user data from API
            const userData = await authApi.getCurrentUser();
            setUser(userData.user);
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            // If token is invalid, clear it
            Cookies.remove('auth_token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // If there's an error, clear the cookie and user state
        Cookies.remove('auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      if (!response || !response.user) {
        throw new Error("Respons login tidak valid");
      }
      
      setUser(response.user);
      
      // Cookie should be set automatically by the server via http-only cookie
      // But we set a local one for frontend authentication state
      if (!Cookies.get('auth_token') && response.token) {
        Cookies.set('auth_token', response.token, { expires: 7 });
      }
      
      toast({
        title: "Login Berhasil",
        description: `Selamat datang kembali, ${response.user.name}!`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Email atau password tidak valid",
        variant: "destructive",
      });
      throw error;
    }
  };

  const adminLogin = async (username: string, password: string) => {
    try {
      const response = await authApi.adminLogin(username, password);
      
      if (!response || !response.user) {
        throw new Error("Respons login admin tidak valid");
      }
      
      setUser(response.user);
      
      // Cookie should be set automatically by the server via http-only cookie
      // But we set a local one for frontend authentication state
      if (!Cookies.get('auth_token') && response.token) {
        Cookies.set('auth_token', response.token, { expires: 7 });
      }
      
      toast({
        title: "Login Admin Berhasil",
        description: `Selamat datang kembali, ${response.user.name}!`,
      });
    } catch (error) {
      console.error("Admin login failed:", error);
      toast({
        title: "Login Admin Gagal",
        description: error instanceof Error ? error.message : "Kredensial admin tidak valid",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      Cookies.remove('auth_token');
      
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari akun",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if backend logout fails, clear local state
      setUser(null);
      Cookies.remove('auth_token');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register(name, email, password);
      setUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Cookie should be set automatically by the server via http-only cookie
      // But we set a local one for frontend authentication state
      if (!Cookies.get('auth_token') && response.token) {
        Cookies.set('auth_token', response.token, { expires: 7 });
      }
      
      toast({
        title: "Registrasi Berhasil",
        description: "Akun Anda berhasil dibuat",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registrasi Gagal",
        description: error instanceof Error ? error.message : "Gagal membuat akun",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Check if current user is admin
  const checkIsAdmin = () => {
    return user?.role === 'admin';
  };

  // Update user profile (name, phone, address)
  const updateUserProfile = async (name: string, phone?: string, address?: { street?: string; city?: string; province?: string; postalCode?: string }) => {
    try {
      const userData = { name, phone, address };
      const response = await userApi.updateProfile(userData);
      
      // Update local user state with new info
      setUser(prev => prev ? { 
        ...prev, 
        name,
        phone,
        // copy flattened fields from response.user if present
        addressStreet: response?.user?.addressStreet ?? prev.addressStreet,
        addressCity: response?.user?.addressCity ?? prev.addressCity,
        addressProvince: response?.user?.addressProvince ?? prev.addressProvince,
        addressPostalCode: response?.user?.addressPostalCode ?? prev.addressPostalCode,
      } : null);
      
      toast({
        title: "Profil Diperbarui",
        description: "Informasi profil Anda berhasil diubah",
      });
      
      return response;
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Gagal Memperbarui Profil",
        description: error instanceof Error ? error.message : "Gagal memperbarui profil",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update user password
  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      await userApi.updatePassword(currentPassword, newPassword);
      
      toast({
        title: "Password Diperbarui",
        description: "Password Anda berhasil diubah",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      toast({
        title: "Gagal Memperbarui Password",
        description: error instanceof Error ? error.message : "Gagal memperbarui password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const contextValue = {
    user,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    login,
    adminLogin,
    logout,
    register,
    checkIsAdmin,
    updateUserProfile,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
