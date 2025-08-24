import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api";
import { Product } from "@/types/product";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

// Local assets per category (match collection visuals)
import imgRings from "../../Asset/Gambar WhatsApp 2025-08-18 pukul 15.15.57_6330c226.jpg";
import imgNecklaces from "../../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.16_629912e4.jpg";
import imgEarrings from "../../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.35_1b452722.jpg";
import imgBracelets from "../../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.52_fac63789.jpg";

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "rings" as "rings" | "necklaces" | "earrings" | "bracelets",
    featured: false,
    stock: 0,
  });
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "rings" as "rings" | "necklaces" | "earrings" | "bracelets",
    featured: false,
    stock: 0,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: () => productApi.getAll(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Set up automatic refetch at regular intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000); // Refetch every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setProducts(data);
      setFilteredProducts(data);
    }
  }, [data]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const search = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddProduct = async () => {
    try {
      await productApi.create(newProduct);
      toast({
        title: "Product added",
        description: "Product has been added successfully",
      });
      setIsAddDialogOpen(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        category: "rings",
        featured: false,
        stock: 0,
      });
      refetch();
    } catch (error) {
      console.error("Failed to add product:", error);
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: "Please try again later",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await productApi.update(selectedProduct.id, editProduct);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        variant: "destructive",
        title: "Failed to update product",
        description: "Please try again later",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await productApi.delete(selectedProduct.id);
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete product",
        description: "Please try again later",
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category as "rings" | "necklaces" | "earrings" | "bracelets",
      featured: product.featured,
      stock: product.stock,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Category-specific asset image
  const getCategoryAssetImage = (category?: string) => {
    switch (category) {
      case "rings":
        return imgRings;
      case "necklaces":
        return imgNecklaces;
      case "earrings":
        return imgEarrings;
      case "bracelets":
        return imgBracelets;
      default:
        return imgRings;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-dark">
            Product Management
          </h1>
          <Card className="w-auto">
            <CardContent className="p-3 flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Total Products:</div>
              <div className="font-bold text-lg">{products.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gold-light/50 focus-visible:ring-gold-light"
            />
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-gold-light to-gold-dark hover:from-gold-dark hover:to-gold-light text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-10">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-gold-light/30 hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <img
                      src={getCategoryAssetImage(product.category)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src.endsWith('/placeholder.svg')) return;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gold-dark">{formatPrice(product.price)}</span>
                    <span className="text-xs bg-gold-light/20 text-gold-dark px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="border-gold-light hover:bg-gold-light/10 hover:text-gold-dark"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(product)}
                        className="border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-gold-light/30 bg-gradient-to-b from-white to-gold-light/5">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-dark">Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details for the new product
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (IDR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value: any) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger className="border-gold-light/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rings">Rings</SelectItem>
                    <SelectItem value="necklaces">Necklaces</SelectItem>
                    <SelectItem value="earrings">Earrings</SelectItem>
                    <SelectItem value="bracelets">Bracelets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured">Featured</Label>
                <Select
                  value={newProduct.featured.toString()}
                  onValueChange={(value: string) => setNewProduct({ ...newProduct, featured: value === "true" })}
                >
                  <SelectTrigger className="border-gold-light/30">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="border-gold-light hover:bg-gold-light/10 hover:text-gold-dark"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-gold-light to-gold-dark hover:from-gold-dark hover:to-gold-light text-primary-foreground"
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-gold-light/30 bg-gradient-to-b from-white to-gold-light/5">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-dark">Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for this product
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (IDR)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl">Image URL</Label>
              <Input
                id="edit-imageUrl"
                value={editProduct.imageUrl}
                onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editProduct.category}
                  onValueChange={(value: any) => setEditProduct({ ...editProduct, category: value })}
                >
                  <SelectTrigger className="border-gold-light/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rings">Rings</SelectItem>
                    <SelectItem value="necklaces">Necklaces</SelectItem>
                    <SelectItem value="earrings">Earrings</SelectItem>
                    <SelectItem value="bracelets">Bracelets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-featured">Featured</Label>
                <Select
                  value={editProduct.featured.toString()}
                  onValueChange={(value: string) => setEditProduct({ ...editProduct, featured: value === "true" })}
                >
                  <SelectTrigger className="border-gold-light/30">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gold-light hover:bg-gold-light/10 hover:text-gold-dark"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProduct}
              className="bg-gradient-to-r from-gold-light to-gold-dark hover:from-gold-dark hover:to-gold-light text-primary-foreground"
            >
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-red-200 bg-gradient-to-b from-white to-red-50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600">Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src={getCategoryAssetImage(selectedProduct.category)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src.endsWith('/placeholder.svg')) return;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">{formatPrice(selectedProduct.price)}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gold-light hover:bg-gold-light/10 hover:text-gold-dark"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteProduct}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProductsPage;