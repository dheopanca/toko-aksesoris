import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Phone, User, Truck } from "lucide-react";
import { Order } from "@/types/order";

interface CustomerOrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerOrderDetailsDialog = ({
  order,
  isOpen,
  onClose,
}: CustomerOrderDetailsDialogProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "processing":
        return "Sedang Diproses";
      case "shipped":
        return "Dalam Pengiriman";
      case "delivered":
        return "Terkirim";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detail Pesanan #{order.id}
          </DialogTitle>
          <DialogDescription>
            Tanggal pesanan: {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Pesanan */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Status Pesanan</h3>
                <Badge className={`text-sm ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
              <Truck className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          {/* Informasi Pengiriman */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Alamat Pengiriman
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-start">
                <User className="mr-2 h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium">{order.address.fullName}</p>
                  <p className="text-sm text-gray-600">{order.address.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="mr-2 h-4 w-4 mt-1 text-gray-500" />
                <p className="text-sm">
                  {order.address.street}, {order.address.city}, {order.address.province}, {order.address.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Detail Produk */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Produk yang Dipesan
            </h3>
            <div className="border rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Produk
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Jumlah
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        Harga
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.product.id}>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-16 w-16 rounded-md object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.product.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">{item.quantity}</td>
                        <td className="px-4 py-4 text-right">{formatPrice(item.price)}</td>
                        <td className="px-4 py-4 text-right font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-medium">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-lg">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Informasi Kontak */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Butuh Bantuan?</p>
                <p className="text-sm text-blue-700">
                  Hubungi kami di nomor telepon yang tertera di atas untuk informasi lebih lanjut
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerOrderDetailsDialog;
