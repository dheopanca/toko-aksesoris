import { Product } from "@/types/product";
import { Order, Address } from "@/types/order";
// Local assets for product images
import imgRing from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.15.57_6330c226.jpg";
import imgNecklace from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.16_629912e4.jpg";
import imgEarring from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.35_1b452722.jpg";
import imgBracelet from "../Asset/Gambar WhatsApp 2025-08-18 pukul 15.16.52_fac63789.jpg";
import Cookies from "js-cookie";

// API Base URL - Default to localhost in development, but can be overridden
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Flag to use mock data when API is not available
const USE_MOCK_DATA = false; // Set to false to use real API

// Mock data for development and when API is unavailable
const MOCK_DATA = {
  products: [
    {
      id: 1,
      name: "Cincin Berlian Solitaire",
      description: "Cincin berlian klasik dengan desain solitaire elegan",
      price: 15000000,
      imageUrl: imgRing,
      category: "rings" as const,
      featured: true,
      stock: 5,
      createdAt: "2023-05-10T00:00:00.000Z"
    },
    {
      id: 2,
      name: "Kalung Mutiara Premium",
      description: "Kalung mutiara air laut asli dengan perak sterling",
      price: 8500000,
      imageUrl: imgNecklace,
      category: "necklaces" as const,
      featured: true,
      stock: 3,
      createdAt: "2023-05-12T00:00:00.000Z"
    },
    {
      id: 3,
      name: "Anting Zamrud",
      description: "Anting zamrud Colombia dengan aksen berlian",
      price: 12000000,
      imageUrl: imgEarring,
      category: "earrings" as const,
      featured: true,
      stock: 2,
      createdAt: "2023-05-15T00:00:00.000Z"
    },
    {
      id: 4,
      name: "Gelang Tennis Berlian",
      description: "Gelang tennis dengan berlian kualitas premium",
      price: 20000000,
      imageUrl: imgBracelet,
      category: "bracelets" as const,
      featured: true,
      stock: 1,
      createdAt: "2023-05-20T00:00:00.000Z"
    }
  ],
  users: [
    {
      id: 1,
      name: "User Demo",
      email: "user@example.com",
      role: "user",
      phone: "081234567890",
    },
    {
      id: 2,
      name: "Admin Demo",
      email: "admin@example.com",
      role: "admin",
      phone: "087654321098",
    }
  ],
  orders: []
};

// Create a persistent mock orders storage that persists across page refreshes
const getMockOrders = () => {
  const storedOrders = localStorage.getItem('mockOrders');
  if (storedOrders) {
    return JSON.parse(storedOrders);
  }
  return [];
};

const saveMockOrders = (orders) => {
  localStorage.setItem('mockOrders', JSON.stringify(orders));
};

// Initialize mock orders from localStorage if available
if (typeof window !== 'undefined') {
  const savedOrders = getMockOrders();
  if (savedOrders.length > 0) {
    MOCK_DATA.orders = savedOrders;
  }
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

// Helper untuk menangani respons fetch dengan fallback ke mock data
const handleResponse = async (response: Response, mockData: any = null) => {
  if (!response.ok) {
    const error = new Error() as ApiError;
    try {
      const errorData = await response.json();
      error.message = errorData.message || `HTTP Error: ${response.status}`;
      error.status = response.status;
      error.data = errorData;
    } catch {
      error.message = `Network Error: ${response.statusText}`;
      error.status = response.status;
    }
    throw error;
  }
  return response.json();
};

// Helper untuk mengambil data (dengan fallback ke mock jika diaktifkan dan API gagal)
const fetchWithMockFallback = async (url: string, options = {}, mockDataKey: string | null = null) => {
  if (USE_MOCK_DATA && mockDataKey && MOCK_DATA[mockDataKey as keyof typeof MOCK_DATA]) {
    console.log(`Using mock data for ${url}`);
    return Promise.resolve(MOCK_DATA[mockDataKey as keyof typeof MOCK_DATA]);
  }
  
  try {
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    console.warn(`API call failed: ${url}`, error);
    
    if (USE_MOCK_DATA && mockDataKey && MOCK_DATA[mockDataKey as keyof typeof MOCK_DATA]) {
      console.log(`Falling back to mock data for ${url}`);
      return MOCK_DATA[mockDataKey as keyof typeof MOCK_DATA];
    }
    throw error;
  }
};

// Helper untuk membuat headers dengan token otentikasi
const getAuthHeaders = () => {
  const token = Cookies.get('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// API untuk produk
export const productApi = {
  getAll: async (): Promise<Product[]> => {
    return fetchWithMockFallback(`${API_BASE_URL}/products`, {}, 'products');
  },
  
  getById: async (id: number): Promise<Product> => {
    try {
      return await fetchWithMockFallback(`${API_BASE_URL}/products/${id}`, {}, null);
    } catch (error) {
      console.warn(`Failed to fetch product with id ${id}, using mock fallback`);
      const mockProduct = MOCK_DATA.products.find(p => p.id === id);
      if (mockProduct) return mockProduct;
      throw new Error(`Product with id ${id} not found`);
    }
  },
  
  getByCategory: async (category: Product["category"]): Promise<Product[]> => {
    try {
      return await fetchWithMockFallback(`${API_BASE_URL}/products/category/${category}`, {}, null);
    } catch (error) {
      console.warn(`Failed to fetch products by category ${category}, using mock fallback`);
      const mockProducts = MOCK_DATA.products.filter(p => p.category === category);
      return mockProducts;
    }
  },
  
  getFeatured: async (): Promise<Product[]> => {
    try {
      return await fetchWithMockFallback(`${API_BASE_URL}/products/featured`, {}, null);
    } catch (error) {
      console.warn("Failed to fetch featured products, using mock fallback");
      const mockProducts = MOCK_DATA.products.filter(p => p.featured);
      return mockProducts;
    }
  },
  
  create: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    return handleResponse(response);
  },
  
  update: async (id: number, updates: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// API untuk otentikasi
export const authApi = {
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      // First check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server response was not in JSON format');
      }

      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.message || 'Login failed') as ApiError;
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      // Ensure we have the expected data structure
      if (!data.token && !data.user) {
        throw new Error('Invalid response format from server');
      }
      
      // Set token in cookie if received from server
      if (data.token) {
        Cookies.set('auth_token', data.token, { 
          expires: 7,
          path: '/',
          sameSite: 'lax',
          secure: window.location.protocol === 'https:'
        });
      }
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      
      // If it's our ApiError type, rethrow it
      if ((error as ApiError).status) {
        throw error;
      }
      
      // For network or other errors, wrap them with more context
      throw new Error(`Login failed: ${error.message}`);
    }
  },
  
  adminLogin: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Admin login error:", error);
      
      if (USE_MOCK_DATA) {
        console.log("Using mock admin login data");
        // Check if credentials match our mock admin by username only
        const adminUser = MOCK_DATA.users.find(u => (u.name === username) && u.role === 'admin');
        
        if (adminUser && username === 'Admin' && password === 'admin123') {
          return {
            user: adminUser,
            token: "mock-jwt-admin-token-for-testing"
          };
        }
        
        throw new Error("Kredensial admin tidak valid");
      }
      
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Logout error:", error);
      
      if (USE_MOCK_DATA) {
        console.log("Using mock logout");
        return { message: "Logged out successfully" };
      }
      
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Get current user error:", error);
      
      if (USE_MOCK_DATA) {
        console.log("Using mock current user data");
        const token = Cookies.get('auth_token');
        
        // If we have a token, return a mock logged in user
        if (token && token.includes('admin')) {
          return { user: MOCK_DATA.users.find(u => u.role === 'admin') };
        } else if (token) {
          return { user: MOCK_DATA.users.find(u => u.role === 'user') };
        }
        
        throw new Error("Not authenticated");
      }
      
      throw error;
    }
  }
};

// API untuk user
export const userApi = {
  updateProfile: async (data: { name: string, phone?: string, email?: string, address?: { street?: string; city?: string; province?: string; postalCode?: string } }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/update-profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Update profile error:", error);
      
      if (USE_MOCK_DATA) {
        console.log("Using mock profile update");
        return { message: "Profile updated successfully", user: { ...MOCK_DATA.users[0], ...data } };
      }
      
      throw error;
    }
  },
  
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/users/update-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  getStoreHours: async () => {
    const response = await fetch(`${API_BASE_URL}/users/store-hours`);
    return handleResponse(response);
  },
  
  updateStoreHours: async (storeHours: any) => {
    const response = await fetch(`${API_BASE_URL}/users/store-hours`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(storeHours),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// API untuk order
export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      if (USE_MOCK_DATA) {
        console.log("Using mock orders data");
        // Return both mock data and locally stored orders
        return getMockOrders();
      }
      throw error;
    }
  },
  
  getById: async (id: number): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch order with ID ${id}:`, error);
      
      // Check if order exists in local storage
      const mockOrders = getMockOrders();
      const mockOrder = mockOrders.find(o => o.id === id);
      
      if (mockOrder) {
        return mockOrder;
      }
      
      throw new Error("Order not found");
    }
  },
  
  getByUserId: async (userId: number): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      if (USE_MOCK_DATA) {
        console.log("Using mock user orders data");
        const mockOrders = getMockOrders();
        return mockOrders.filter(order => order.userId === userId);
      }
      throw error;
    }
  },
  
  create: async (userId: number, items: { productId: number, quantity: number }[], address: Address): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items, address }),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to create order:", error);
      
      if (USE_MOCK_DATA) {
        console.log("Using mock order creation");
        
        // Get existing mock orders
        const mockOrders = getMockOrders();
        
        // Create a new mock order with a unique ID
        const newOrderId = mockOrders.length > 0 
          ? Math.max(...mockOrders.map(o => o.id)) + 1 
          : 1;
        
        // Calculate total from items based on product prices
        let total = 0;
        const orderItems = items.map(item => {
          const product = MOCK_DATA.products.find(p => p.id === item.productId);
          if (product) {
            total += product.price * item.quantity;
            return {
              product,
              quantity: item.quantity,
              price: product.price
            };
          }
          return null;
        }).filter(Boolean);
        
        // Create a new mock order
        const newOrder: Order = {
          id: newOrderId,
          userId: userId,
          items: orderItems as any,
          total: total,
          address: address,
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Save to mock orders in localStorage
        mockOrders.push(newOrder);
        saveMockOrders(mockOrders);
        
        // Also update the mock data in memory
        MOCK_DATA.orders = mockOrders;
        
        return newOrder;
      }
      
      throw error;
    }
  },
  
  updateStatus: async (id: number, status: Order["status"]): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Failed to update order status:", error);
      
      if (USE_MOCK_DATA) {
        console.log("Using mock order status update");
        const mockOrders = getMockOrders();
        const orderIndex = mockOrders.findIndex(o => o.id === id);
        
        if (orderIndex !== -1) {
          mockOrders[orderIndex].status = status;
          mockOrders[orderIndex].updatedAt = new Date().toISOString();
          
          // Save updated orders
          saveMockOrders(mockOrders);
          
          // Also update in-memory mock data
          MOCK_DATA.orders = mockOrders;
          
          return mockOrders[orderIndex];
        }
        throw new Error("Order not found");
      }
      
      throw error;
    }
  }
};