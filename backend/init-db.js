const sequelize = require('./config/database');
const { User, Product } = require('./models');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  try {
    // Force sync database (this will drop all tables and recreate them)
    await sequelize.sync({ force: true });
    console.log('Database structure synchronized');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed by User model hooks
      role: 'admin',
      active: true,
      phone: '081234567890',
    });
    console.log('Admin user created');

    // Create demo user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'User Demo',
      email: 'user@example.com',
      password: 'user123', // Will be hashed by User model hooks
      role: 'user',
      active: true,
      phone: '087654321098',
    });
    console.log('Demo user created');

    // Create demo products
    await Product.bulkCreate([
      {
        name: 'Cincin Berlian Solitaire',
        description: 'Cincin berlian klasik dengan desain solitaire elegan',
        price: 2000,
        imageUrl: '/products/ring-1.jpg',
        category: 'rings',
        featured: true,
        stock: 5
      },
      {
        name: 'Kalung Mutiara Premium',
        description: 'Kalung mutiara air laut asli dengan perak sterling',
        price: 3500,
        imageUrl: '/products/necklace-1.jpg',
        category: 'necklaces',
        featured: true,
        stock: 3
      },
      {
        name: 'Anting Zamrud',
        description: 'Anting zamrud Colombia dengan aksen berlian',
        price: 1500,
        imageUrl: '/products/earring-1.jpg',
        category: 'earrings',
        featured: false,
        stock: 2
      },
      {
        name: 'Gelang Tennis Berlian',
        description: 'Gelang tennis dengan berlian kualitas premium',
        price: 4000,
        imageUrl: '/products/bracelet-1.jpg',
        category: 'bracelets',
        featured: true,
        stock: 1
      }
    ]);
    console.log('Demo products created');

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Run the initialization
initDatabase(); 