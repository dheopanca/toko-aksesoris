// @ts-nocheck
import { Product } from "@/types/product";
import { Order, Address } from "@/types/order";
import Cookies from "js-cookie";

// API Base URL - Use env override; default to relative /api in production and localhost in dev
const isProd = import.meta.env.MODE === 'production' || import.meta.env.VITE_NODE_ENV === 'production';
const API_BASE_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.length > 0
    ? import.meta.env.VITE_API_URL
    : (isProd ? '/api' : 'http://localhost:3001/api');

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
      imageUrl: "/products/ring-1.jpg",
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
      imageUrl: "/products/necklace-1.jpg",
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
      imageUrl: "/products/earring-1.jpg",
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
      imageUrl: "/products/bracelet-1.jpg",
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
      phone: "081234567890"
    },
    {
      id: 2,
      name: "Admin Demo",
      email: "admin@example.com",
      role: "admin",
      phone: "087654321098"
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

// Fungsi helper untuk menangani response API
// Menambahkan timeout pada fetch request
const handleResponse = async (response: Response, mockData: any = null) => {
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    // Jika response bukan JSON, coba parse sebagai teks atau berikan pesan default
    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await response.text();
      const error = new Error(`Server responded with ${response.status}: ${errorText.substring(0, 100)}...`) as ApiError; // Ambil 100 karakter pertama
      error.status = response.status;
      throw error;
    }
    
    // Jika JSON, parse error message dari JSON body
    try {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'API request failed') as ApiError;
      error.status = response.status;
      error.data = errorData;
      throw error;
    } catch (jsonError) {
      // Gagal parse JSON error body
      const error = new Error(`API request failed with status ${response.status}, but could not parse error body`) as ApiError;
      error.status = response.status;
      throw error;
    }
  }
  
  // Jika response sukses tapi bukan JSON (misal: 204 No Content atau 200 OK tanpa body)
  if (!contentType || !contentType.includes('application/json')) {
    // Jika ada mock data, kembalikan mock data
    if (mockData) return mockData;
    // Jika tidak ada mock data dan bukan JSON, kembalikan objek kosong atau null tergantung konteks (di sini objek kosong)
    return {}; 
  }

  // Jika response sukses dan JSON, parse dan kembalikan
  try {
    const data = await response.json();
    return data;
  } catch (jsonError) {
    // Gagal parse JSON body sukses
    const error = new Error('API request succeeded but could not parse JSON response') as ApiError;
    throw error;
  }
};

// Menambahkan timeout ke fetch
const fetchWithTimeout = async (url: string, options = {}, timeout = 30000) => { // Default timeout 30 detik
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    // Tangani error abort (timeout) atau error jaringan lainnya
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
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
    return fetchWithMockFallback(`${API_BASE_URL}/products`, { credentials: 'include' }, 'products');
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
    try {
      console.log('API: Creating product with data:', product);
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(product),
        credentials: 'include'
      });
      
      console.log('API: Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Failed to create product') as ApiError;
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      const data = await response.json();
      console.log('API: Product created successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Error creating product:', error);
      throw error;
    }
  },
  
  update: async (id: number, updates: Partial<Product>): Promise<Product> => {
    try {
      console.log('API: Sending update request for product', id, 'with data:', updates);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Accept': 'application/json'
        },
        body: JSON.stringify(updates),
        credentials: 'include'
      });
      
      // Log response headers for debugging
      console.log('API: Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Use handleResponse to process the response
      const data = await handleResponse(response);
      console.log('API: Update successful, received data:', data);
      return data;
    } catch (error) {
      console.error('API: Error updating product:', error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  uploadImage: async (file: File): Promise<{ imageUrl: string; filename: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeaders().Authorization || '',
        },
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Failed to upload image') as ApiError;
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API: Error uploading image:', error);
      throw error;
    }
  }
};

// API untuk otentikasi
export const authApi = {
  register: async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password, phone }),
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
  
  adminLogin: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Admin login error:", error);
      
      if (USE_MOCK_DATA) {
        console.log("Using mock admin login data");
        // Check if credentials match our mock admin
        const adminUser = MOCK_DATA.users.find(u => u.email === email && u.role === 'admin');
        
        if (adminUser && email === 'admin@example.com' && password === 'admin123') {
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
  updateProfile: async (data: { name: string, phone?: string, email?: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/update-profile`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server response was not in JSON format');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to update profile') as ApiError;
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      return response.json();
    } catch (error) {
      console.error("Update profile error:", error);
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
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  getById: async (id: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  getByUserId: async (userId: number): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse(response);
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
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};