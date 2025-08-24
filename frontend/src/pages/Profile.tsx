import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Package, User, MapPin, Loader, ShoppingCart, FileText } from "lucide-react";
import { orderApi } from "@/services/api";
import { Order } from "@/types/order";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: ""
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect admin users or show message
  useEffect(() => {
    if (user && user.role === 'admin') {
      // Option 1: Redirect to admin dashboard
      // navigate('/admin'); // Assuming you have a navigate hook/function
      // Option 2: Show an access denied message
      toast({
        title: "Akses Ditolak",
        description: "Halaman profil user tidak tersedia untuk admin.",
        variant: "destructive",
      });
      // Clear user state to prevent rendering profile info
      // This might affect other parts if not handled, maybe better to just render message
      // setUser(null); // Uncomment with caution
    }
  }, [user]); // Re-run effect when user changes

  // Fetch user's orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || user.role === 'admin') return; // Prevent fetching for admin

      setLoading(true);
      try {
        const userOrders = await orderApi.getByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast({
          title: "Error",
          description: "Gagal mengambil data pesanan",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent update for admin
    if (user && user.role === 'admin') return;
    
    // Validate phone number
    if (phone && !phone.match(/^[0-9]{10,15}$/)) {
      toast({
        title: "Format Nomor Telepon Tidak Valid",
        description: "Nomor telepon harus berisi 10-15 digit angka",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateUserProfile(name, email, phone);
      
      toast({
        title: "Profil Diperbarui",
        description: "Profil Anda berhasil diperbarui",
      });
    } catch (error) {
      console.error("Update profile failed:", error);
      toast({
        title: "Gagal Memperbarui Profil",
        description: error instanceof Error ? error.message : "Gagal memperbarui profil",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Render nothing or a message if user is admin or not logged in
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <p>Silakan masuk untuk melihat profil Anda.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is admin, show access denied message
  if (user.role === 'admin') {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-red-600">
              <p className="text-xl font-semibold">Akses Ditolak</p>
              <p>Halaman ini tidak tersedia untuk akun admin.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is a regular user, render the profile page
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profil Saya</h1>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="account">Akun Saya</TabsTrigger>
            <TabsTrigger value="orders">Pesanan Saya</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="space-y-4 w-full">
                      <h2 className="text-xl font-semibold flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Informasi Pribadi
                      </h2>

                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Lengkap</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Nomor Telepon</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6 pt-6 border-t">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    >
                      Simpan Perubahan
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Keluar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Pesanan Saya
                </h2>

                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader className="h-8 w-8 animate-spin text-amber-500" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Pesanan</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status === 'completed' ? 'Selesai' :
                                 order.status === 'pending' ? 'Menunggu' :
                                 order.status === 'processing' ? 'Diproses' :
                                 order.status === 'cancelled' ? 'Dibatalkan' :
                                 order.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(order.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Anda belum memiliki pesanan apa pun</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;