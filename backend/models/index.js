const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define associations
User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Sync all models with database
const syncDatabase = async (retries = 3) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error.message);
    
    if (retries > 0) {
      console.log(`Retrying database sync... (${retries} attempts remaining)`);
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
      return syncDatabase(retries - 1);
    }
    
    console.error('Failed to sync database after multiple attempts. Exiting...');
    process.exit(1);
  }
};

module.exports = {
  syncDatabase,
  User,
  Product,
  Order,
  OrderItem
};
