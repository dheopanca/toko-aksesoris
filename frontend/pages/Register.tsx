import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "@/components/ui/use-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Silakan masukkan alamat email yang valid"),
  phone: z.string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(13, "Nomor telepon maksimal 13 digit")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sesuai",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      await register(data.name, data.email, data.password, data.phone);
      toast({
        title: "Registrasi Berhasil",
        description: "Selamat datang di Permata Indah Jewelry",
        variant: "default",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      // Handle specific error messages from backend
      const errorMessage = error.data?.message || "Terjadi kesalahan saat registrasi";
      
      if (error.data?.field === 'email') {
        form.setError('email', {
          type: 'manual',
          message: errorMessage
        });
      } else {
        toast({
          title: "Registrasi Gagal",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold mb-2">Buat Akun Baru</h1>
          <p className="text-gray-600 italic">
            Bergabunglah untuk akses koleksi perhiasan eksklusif kami
          </p>
        </div>
        
        <div className="bg-white p-8 shadow-lg rounded-lg border border-amber-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" className="border-amber-200 focus-visible:ring-amber-400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan email anda" type="email" className="border-amber-200 focus-visible:ring-amber-400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Nomor Telepon (Opsional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Masukkan nomor telepon" 
                        type="tel"
                        className="border-amber-200 focus-visible:ring-amber-400" 
                        {...field} 
                      />
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
                      <Input placeholder="Buat password" type="password" className="border-amber-200 focus-visible:ring-amber-400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Konfirmasi password anda" type="password" className="border-amber-200 focus-visible:ring-amber-400" {...field} />
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
                {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Sudah memiliki akun?{" "}
              <Link to="/login" className="text-amber-600 font-semibold hover:underline">
                Masuk disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
