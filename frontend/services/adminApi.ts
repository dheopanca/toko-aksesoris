import { Admin, AdminListResponse, AdminDetailsResponse, AdminStatusUpdateResponse } from '@/types/admin';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = Cookies.get('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const adminApi = {
  // Get all admins
  getAllAdmins: async (): Promise<AdminListResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/admin`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch admins');
    }
    
    return response.json();
  },

  // Get admin details
  getAdminDetails: async (id: number): Promise<AdminDetailsResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/admin/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch admin details');
    }
    
    return response.json();
  },

  // Update admin status
  updateAdminStatus: async (id: number, active: boolean): Promise<AdminStatusUpdateResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/admin/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ active }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to update admin status');
    }
    
    return response.json();
  }
};
