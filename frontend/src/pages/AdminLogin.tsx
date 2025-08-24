
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
import { Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email("Silakan masukkan email yang valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
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
      await adminLogin(data.email, data.password);
      toast({
        title: "Login Admin Berhasil",
        description: "Selamat datang di Panel Admin Permata Indah",
        variant: "default",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login failed:", error);
      const errorMsg = error instanceof Error ? error.message : "Email atau password admin tidak valid";
      
      setErrorMessage(errorMsg);
      setShowErrorDialog(true);
      
      toast({
        title: "Login Admin Gagal",
        description: errorMsg,
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
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <h1 className="text-3xl font-playfair font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-600 italic">
            Masuk untuk mengelola toko Permata Indah
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
                    <FormLabel className="font-medium">Email Admin</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan email admin" type="email" className="border-amber-200 focus-visible:ring-amber-400" {...field} />
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
                      <Input placeholder="Masukkan password admin" type="password" className="border-amber-200 focus-visible:ring-amber-400" {...field} />
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
                {isLoading ? "Masuk..." : "Masuk sebagai Admin"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-2">
              Akun Admin Demo:
            </p>
            <p className="text-center text-sm text-gray-500">
              <span className="font-medium">Admin:</span> admin@example.com / admin123
            </p>
            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-amber-600 hover:underline">
                Login sebagai User
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">Login Admin Gagal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">{errorMessage}</p>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={() => setShowErrorDialog(false)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLoginPage;
