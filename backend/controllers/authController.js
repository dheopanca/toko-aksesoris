const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ValidationError } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',
  domain: 'localhost'
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Registration attempt:', { name, email });

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      active: true,
      lastLogin: new Date()
    });

    console.log('User created successfully:', { id: user.id, email: user.email });

    // Generate token
    const token = generateToken(user);
    console.log('Token generated successfully');

    // Set cookie
    res.cookie('auth_token', token, cookieOptions);
    console.log('Cookie set successfully');

    // Return success response
    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addressStreet: user.addressStreet,
        addressCity: user.addressCity,
        addressProvince: user.addressProvince,
        addressPostalCode: user.addressPostalCode
      },
      token // Include token in response for frontend
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: 'Validasi gagal',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      message: 'Terjadi kesalahan saat registrasi',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password harus diisi',
        field: !email ? 'email' : 'password'
      });
    }

    console.log('Login request received:', { email });

    // Use the email-based login for regular users
    const user = await User.loginByEmail(email, password);
    console.log('User logged in successfully:', { id: user.id, email: user.email });

    // Check if user role is not admin for regular login
    if (user.role === 'admin') {
      console.log('Admin user attempting regular login');
      return res.status(403).json({ 
        message: 'Silakan gunakan halaman login admin',
        field: 'email'
      });
    }

    // Generate token
    const token = generateToken(user);
    console.log('Token generated successfully');

    // Set cookie
    res.cookie('auth_token', token, cookieOptions);
    console.log('Cookie set successfully');

    // Send response
    const response = {
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addressStreet: user.addressStreet,
        addressCity: user.addressCity,
        addressProvince: user.addressProvince,
        addressPostalCode: user.addressPostalCode
      },
      token
    };
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific error cases
    if (error.message.includes('tidak valid')) {
      return res.status(400).json({ 
        success: false,
        message: 'Email atau password tidak valid',
        field: 'email'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username dan password harus diisi',
        field: 'username'
      });
    }

    // Gunakan username saja untuk login
    const user = await User.login(username, password);

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Akses ditolak. Diperlukan hak akses admin.',
        field: 'username'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie('auth_token', token, cookieOptions);

    res.json({
      message: 'Login admin berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addressStreet: user.addressStreet,
        addressCity: user.addressCity,
        addressProvince: user.addressProvince,
        addressPostalCode: user.addressPostalCode
      },
      token // Include token in response for frontend
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(400).json({ 
      message: error.message || 'Username atau password tidak valid',
      field: 'username'
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
        active: true
      },
      attributes: ['id', 'name', 'email', 'role', 'lastLogin', 'phone', 'addressStreet', 'addressCity', 'addressProvince', 'addressPostalCode']
    });

    if (!user) {
      return res.status(401).json({ message: 'Sesi tidak valid' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    res.clearCookie('auth_token', cookieOptions);
    res.json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat logout' });
  }
};
