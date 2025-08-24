import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/services/api";
import { Order } from "@/types/order";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => orderApi.getAll(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  // Set up automatic refetch at regular intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 15000); // Refetch every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  useEffect(() => {
    if (data) {
      // Sort orders by date (newest first)
      const sortedOrders = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    }
  }, [data]);
  
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      await orderApi.updateStatus(selectedOrder.id, newStatus);
      
      toast({
        title: "Status updated",
        description: `Order #${selectedOrder.id} status changed to ${newStatus}`,
      });
      
      setIsUpdateStatusDialogOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "Please try again later",
      });
    }
  };
  
  const openViewDialog = (order: any) => {
    // Mapping agar items selalu ada
    setSelectedOrder({
      ...order,
      items: (order.OrderItems || order.items || []).map((item: any) => ({
        product: item.Product || item.product,
        quantity: item.quantity,
        price: item.price,
      })),
    });
    setIsViewDialogOpen(true);
    console.log("Selected Order for View Details:", order);
  };
  
  const openUpdateStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsUpdateStatusDialogOpen(true);
  };
  
  // Filter orders by search term (searching by order ID, customer name, or status)
  const filteredOrders = orders.filter((order) => {
    const orderIdString = order.id.toString();
    const customerName = order.address.fullName.toLowerCase();
    const statusString = order.status.toLowerCase();
    
    const search = searchTerm.toLowerCase();
    
    return (
      orderIdString.includes(search) ||
      customerName.includes(search) ||
      statusString.includes(search)
    );
  });
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Calendar className="h-4 w-4 mr-1" />;
      case "processing":
        return <Package className="h-4 w-4 mr-1" />;
      case "shipped":
        return <Truck className="h-4 w-4 mr-1" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-dark">
            Order Management
          </h1>
          <Card className="w-auto">
            <CardContent className="p-3 flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Total Orders:</div>
              <div className="font-bold text-lg">{orders.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders by ID, customer name, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gold-light/50 focus-visible:ring-gold-light"
          />
        </div>
        
        {/* Orders Table */}
        <div className="overflow-x-auto rounded-lg border border-gold-light/20 shadow-md">
          <table className="min-w-full divide-y divide-gold-light/20">
            <thead className="bg-gradient-to-r from-gold-light/10 to-gold-dark/5">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-dark uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-dark uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-dark uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-dark uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-dark uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gold-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gold-light/20">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gold-light/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.address.fullName}</div>
                      <div className="text-xs text-gray-500">{order.address.city}, {order.address.province}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="outline"
                          className="bg-white text-gold-dark border-gold-light hover:bg-gold-light/10"
                          onClick={() => openViewDialog(order)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-white text-gold-dark border-gold-light hover:bg-gold-light/10"
                          onClick={() => openUpdateStatusDialog(order)}
                        >
                          Update Status
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* View Order Dialog */}
      {isViewDialogOpen && selectedOrder && (
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] border-gold-light/30 bg-gradient-to-b from-white to-gold-light/5">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-dark">Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id} - {selectedOrder?.createdAt && formatDate(selectedOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gold-dark">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-gold-light/5 p-3 rounded-lg border border-gold-light/20">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1">{selectedOrder.address?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1">{selectedOrder.address?.phone || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="mt-1">
                      {selectedOrder.address
                        ? `${selectedOrder.address.street || ''}, ${selectedOrder.address.city || ''}, ${selectedOrder.address.province || ''}, ${selectedOrder.address.postalCode || ''}`.replace(/, \s*,/g, ', ').replace(/^, | ,$/g, '')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gold-dark">Order Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div className="border rounded-md overflow-hidden border-gold-light/20">
                  <table className="min-w-full divide-y divide-gold-light/20">
                    <thead className="bg-gradient-to-r from-gold-light/10 to-gold-dark/5">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gold-dark uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gold-dark uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gold-dark uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gold-dark uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gold-light/20">
                      {selectedOrder.items.map((item) => (
                          <tr key={item.product?.id || item.id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0">
                                <img
                                    src={item.product?.imageUrl || ''}
                                    alt={item.product?.name || 'Product Image'}
                                  className="h-12 w-12 rounded-md object-cover border border-gold-light/30"
                                />
                              </div>
                              <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.product?.name || 'N/A'}</div>
                                  <div className="text-xs text-gray-500">{item.product?.category || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center text-sm">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-right text-sm">
                              {formatPrice(item.price || 0)}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-medium">
                              {formatPrice((item.price || 0) * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gradient-to-r from-gold-light/10 to-gold-dark/5">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium">
                          Total
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold">
                            {formatPrice(selectedOrder.total || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">No items found for this order.</div>
                )}
              </div>
              
              {/* Order Status */}
              <div className="flex justify-between items-center bg-gold-light/5 p-4 rounded-lg border border-gold-light/20">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <span className={`inline-flex items-center mt-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
                <Button 
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    openUpdateStatusDialog(selectedOrder);
                  }}
                  className="bg-gradient-to-r from-gold-light to-gold-dark hover:from-gold-dark hover:to-gold-light text-primary-foreground"
                >
                  Update Status
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>
      )}
      
      {/* Update Status Dialog */}
      {isUpdateStatusDialogOpen && selectedOrder && (
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-gold-light/30 bg-gradient-to-b from-white to-gold-light/5">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-dark">Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Select New Status</p>
              <Select
                value={newStatus}
                onValueChange={(value: Order["status"]) => setNewStatus(value)}
              >
                <SelectTrigger className="border-gold-light/30">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
              <Button variant="outline" onClick={handleUpdateStatus} className="bg-white text-gold-dark border-gold-light hover:bg-gold-light/10">
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage;