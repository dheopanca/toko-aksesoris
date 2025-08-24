const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, addressStreet, addressCity, addressProvince, addressPostalCode } = req.body;
    const userId = req.user.id;

    // Validate input
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (name && (name.length < 2 || name.length > 50)) {
      return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }

    // Find the user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Email already in use',
          field: 'email'
        });
      }
      user.email = email;
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }
    
    // Update phone if provided
    if (phone !== undefined) {
      user.phone = phone;
    }

    // Update address (support both nested object and flat fields)
    const addr = address || {};
    const street = addr.street !== undefined ? addr.street : addressStreet;
    const city = addr.city !== undefined ? addr.city : addressCity;
    const province = addr.province !== undefined ? addr.province : addressProvince;
    const postalCode = addr.postalCode !== undefined ? addr.postalCode : addressPostalCode;

    if (street !== undefined) user.addressStreet = street;
    if (city !== undefined) user.addressCity = city;
    if (province !== undefined) user.addressProvince = province;
    if (postalCode !== undefined) user.addressPostalCode = postalCode;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addressStreet: user.addressStreet,
        addressCity: user.addressCity,
        addressProvince: user.addressProvince,
        addressPostalCode: user.addressPostalCode
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'An error occurred while updating the profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Find the user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password (bcrypt hashing is handled in User model hooks)
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get store hours
exports.getStoreHours = async (req, res) => {
  try {
    const storeHours = {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '10:00', close: '14:00' }
    };
    
    res.json({ storeHours });
  } catch (error) {
    console.error('Get store hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update store hours
exports.updateStoreHours = async (req, res) => {
  try {
    const storeHours = req.body;
    
    console.log('Store hours updated:', storeHours);
    
    res.json({
      message: 'Store hours updated successfully',
      storeHours
    });
  } catch (error) {
    console.error('Update store hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
