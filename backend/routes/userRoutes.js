
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Protected routes (require login)
router.put('/update-profile', authenticate, userController.updateProfile);
router.put('/update-password', authenticate, userController.updatePassword);

// Admin-only routes
router.get('/store-hours', userController.getStoreHours);
router.put('/store-hours', isAdmin, userController.updateStoreHours);

module.exports = router;
