
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email("Silakan masukkan email yang valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await login(data.email, data.password);
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali di Permata Indah Jewelry",
        variant: "default",
      });
      navigate(redirectTo);
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login Gagal",
        description: "Email atau password tidak valid",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold mb-2">Selamat Datang Kembali</h1>
          <p className="text-gray-600 italic">
            Masuk untuk melanjutkan pengalaman belanja Anda
          </p>
        </div>
        
        <div className="bg-white p-8 shadow-lg rounded-lg border border-amber-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan email Anda" type="email" className="border-amber-200 focus-visible:ring-amber-400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan password" type="password" className="border-amber-200 focus-visible:ring-amber-400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-md hover:shadow-lg transition-all" 
                disabled={isLoading}
              >
                {isLoading ? "Masuk..." : "Masuk"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Belum memiliki akun?{" "}
              <Link to="/register" className="text-amber-600 font-semibold hover:underline">
                Buat akun baru
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-4">
              Akun Demo:
            </p>
            <div className="space-y-2 text-sm text-gray-500 text-center">
              <p><span className="font-medium">User:</span> user@example.com / user123</p>
            </div>
            <div className="mt-4 text-center">
              <Link to="/admin/login" className="text-sm text-amber-600 hover:underline">
                Login sebagai Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
