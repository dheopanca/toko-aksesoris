export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'admin';
  active: boolean;
  lastLogin: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminListResponse {
  message: string;
  admins: Admin[];
}

export interface AdminDetailsResponse {
  message: string;
  admin: Admin;
}

export interface AdminStatusUpdateRequest {
  active: boolean;
}

export interface AdminStatusUpdateResponse {
  message: string;
  admin: {
    id: number;
    name: string;
    email: string;
    active: boolean;
  };
}
