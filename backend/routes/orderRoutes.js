
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Protected routes
router.get('/user/:userId', authenticate, orderController.getOrdersByUser);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);

// Admin only routes
router.get('/', authenticate, isAdmin, orderController.getAllOrders);
router.patch('/:id/status', authenticate, isAdmin, orderController.updateOrderStatus);

module.exports = router;
