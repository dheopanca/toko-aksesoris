
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Register
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

// Admin Login
router.post('/admin/login', authController.adminLogin);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
