import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from cookies
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to extract data from response
const extractData = (response: any) => {
  return response.data?.data || response.data || response;
};

// Product API
export const productApi = {
  getAll: () => api.get('/products').then(extractData),
  getById: (id: string) => api.get(`/products/${id}`).then(extractData),
  getFeatured: () => api.get('/products/featured').then(extractData),
  getByCategory: (category: string) => api.get(`/products/category/${category}`).then(extractData),
  create: (data: any) => api.post('/products', data).then(extractData),
  update: (id: string, data: any) => api.put(`/products/${id}`, data).then(extractData),
  delete: (id: string) => api.delete(`/products/${id}`).then(extractData),
  uploadImage: (data: FormData) => api.post('/products/upload-image', data).then(extractData),
};

// Auth API
export const authApi = {
  register: (data: any) => api.post('/auth/register', data).then(extractData),
  login: (data: any) => api.post('/auth/login', data).then(extractData),
  adminLogin: (data: any) => api.post('/auth/admin/login', data).then(extractData),
  logout: () => api.post('/auth/logout').then(extractData),
  getCurrentUser: () => api.get('/auth/me').then(extractData),
};

// User API
export const userApi = {
  updateProfile: (data: any) => api.put('/users/update-profile', data).then(extractData),
  updatePassword: (data: any) => api.put('/users/update-password', data).then(extractData),
  getStoreHours: () => api.get('/users/store-hours').then(extractData),
  updateStoreHours: (data: any) => api.put('/users/store-hours', data).then(extractData),
};

// Order API
export const orderApi = {
  create: (data: any) => api.post('/orders', data).then(extractData),
  getById: (id: string) => api.get(`/orders/${id}`).then(extractData),
  getByUser: (userId: string) => api.get(`/orders/user/${userId}`).then(extractData),
  getAll: () => api.get('/orders').then(extractData),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }).then(extractData),
};

export default api;