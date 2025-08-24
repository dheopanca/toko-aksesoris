import React, { useState } from 'react';
import { Admin } from '@/types/admin';
import { adminApi } from '@/services/adminApi';

interface AdminDetailsDialogProps {
  admin: Admin;
  onClose: () => void;
  onStatusUpdate: (id: number, active: boolean) => void;
}

const AdminDetailsDialog: React.FC<AdminDetailsDialogProps> = ({
  admin,
  onClose,
  onStatusUpdate
}) => {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (active: boolean) => {
    setLoading(true);
    try {
      await adminApi.updateAdminStatus(admin.id, active);
      onStatusUpdate(admin.id, active);
    } catch (error) {
      console.error("Failed to update admin status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-details-dialog">
      <h2>Admin Details</h2>
      <div className="admin-info">
        <p><strong>ID:</strong> {admin.id}</p>
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Phone:</strong> {admin.phone || 'N/A'}</p>
        <p><strong>Active:</strong> {admin.active ? 'Yes' : 'No'}</p>
        <p><strong>Last Login:</strong> {admin.lastLogin || 'N/A'}</p>
      </div>
      <div className="admin-actions">
        <button 
          onClick={() => handleStatusUpdate(!admin.active)}
          disabled={loading}
        >
          {admin.active ? 'Deactivate' : 'Activate'}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AdminDetailsDialog;
