const { Order, OrderItem, Product, User } = require('../models');
const sequelize = require('../config/database');

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is authorized to view this order
    if (req.user.role !== 'admin' && order.UserId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
  try {
    // Users can only see their own orders unless they're admin
    const userId = req.user.role === 'admin' ? req.params.userId : req.user.id;
    
    const orders = await Order.findAll({
      where: { UserId: userId },
      include: [
        {
          model: OrderItem,
          include: [Product]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { items, address } = req.body;
    
    // Extract phone number from address
    const phone = address.phone;
    
    // Validate phone number is provided
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // Validate phone number format
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }
    
    if (phone.length < 10 || phone.length > 15) {
      return res.status(400).json({ message: 'Phone number must be between 10 and 15 digits' });
    }
    
    // Calculate total and validate items
    let total = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }
      
      // Reduce stock
      await product.update({
        stock: product.stock - item.quantity
      }, { transaction });
      
      // Add to validated items
      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
      
      // Add to total
      total += product.price * item.quantity;
    }
    
    // Create order
    const order = await Order.create({
      UserId: req.user.id,
      total,
      address,
      phone,
      status: 'pending'
    }, { transaction });
    
    // Create order items
    const orderItems = [];
    for (const item of validatedItems) {
      const orderItem = await OrderItem.create({
        OrderId: order.id,
        ProductId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }, { transaction });
      
      orderItems.push(orderItem);
    }
    
    await transaction.commit();
    
    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        }
      ]
    });
    
    res.status(201).json(completeOrder);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(400).json({ message: error.message || 'Error creating order' });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.update({ status });
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
