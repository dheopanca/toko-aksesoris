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

  // Fetch user's orders when component mounts
  useEffect(() => {
    // Sync form fields with current user data, including address
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress({
        street: (user as any).addressStreet || "",
        city: (user as any).addressCity || "",
        province: (user as any).addressProvince || "",
        postalCode: (user as any).addressPostalCode || "",
      });
    }

    const fetchOrders = async () => {
      if (!user) return;
      
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
    
    try {
      await updateUserProfile(name, phone, {
        street: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
      });
      
      // Update email separately (would require backend support in a real app)
      // This is simulated for the mockup
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile information.",
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

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <p>Please log in to view your profile.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        {/* Bagian Alamat */}
                        <div className="space-y-2">
                          <Label htmlFor="street">Alamat Jalan</Label>
                          <Input
                            id="street"
                            placeholder="Masukkan alamat jalan Anda"
                            value={address.street}
                            onChange={(e) =>
                              setAddress((prev) => ({ ...prev, street: e.target.value }))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">Kota</Label>
                            <Input
                              id="city"
                              placeholder="Masukkan kota Anda"
                              value={address.city}
                              onChange={(e) =>
                                setAddress((prev) => ({ ...prev, city: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Kode Pos</Label>
                            <Input
                              id="postalCode"
                              placeholder="Masukkan kode pos"
                              value={address.postalCode}
                              onChange={(e) =>
                                setAddress((prev) => ({ ...prev, postalCode: e.target.value }))
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="province">Provinsi</Label>
                          <Input
                            id="province"
                            placeholder="Masukkan provinsi Anda"
                            value={address.province}
                            onChange={(e) =>
                              setAddress((prev) => ({ ...prev, province: e.target.value }))
                            }
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