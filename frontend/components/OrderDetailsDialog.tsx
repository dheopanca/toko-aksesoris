import { useState } from "react";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Format harga ke Rupiah
function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,

  }).format(price);
}

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: number, status: Order["status"]) => void;
}
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-emerald-100 text-emerald-800",
};

const statusLabels = {
  pending: "Menunggu",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Diterima",
  cancelled: "Dibatalkan",
  completed: "Selesai",
};

const OrderDetailsDialog = ({ order, isOpen, onClose, onUpdateStatus }: OrderDetailsDialogProps) => {
  // Debug: log data order yang diterima dialog
  console.log('[DEBUG][OrderDetailsDialog] order:', order);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending");

  const handleUpdateStatus = async () => {
    if (!order || !onUpdateStatus) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus);
      onClose();
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };


  if (!order || !Array.isArray(order.items)) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detail Pesanan</DialogTitle>
          <DialogDescription>
            ID Pesanan: #{order.id} - {new Date(order.createdAt).toLocaleDateString('id-ID')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Informasi Pelanggan</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-500">Nama</p>
                <p className="mt-1">{order.address.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telepon</p>
                <p className="mt-1">{order.address.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Alamat</p>
                <p className="mt-1">
                  {order.address.street}, {order.address.city}, {order.address.province}, {order.address.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Item Pesanan</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-center">Jumlah</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                            <div className="text-xs text-gray-500">{item.product.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Status only */}
          <div className="flex flex-col gap-4">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
}
export default OrderDetailsDialog;
