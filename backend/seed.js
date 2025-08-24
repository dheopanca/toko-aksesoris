const { User, Product } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      active: true,
      phone: '081234567890'
    });
    
    // Create demo user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'User Demo',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      active: true,
      phone: '087654321098'
    });
    
    // Create sample products
    const products = [
      {
        name: "Cincin Perak Elegan",
        description: "Cincin perak dengan desain minimalis yang elegan",
        price: 1500,
        imageUrl: "/products/ring-1.jpg",
        category: "rings",
        featured: true,
        stock: 10
      },
      {
        name: "Kalung Perak Simpel",
        description: "Kalung perak dengan desain simpel dan modern",
        price: 2500,
        imageUrl: "/products/necklace-1.jpg",
        category: "necklaces",
        featured: true,
        stock: 8
      },
      {
        name: "Anting Perak Cantik",
        description: "Anting perak dengan desain yang cantik dan ringan",
        price: 1000,
        imageUrl: "/products/earring-1.jpg",
        category: "earrings",
        featured: true,
        stock: 15
      },
      {
        name: "Gelang Perak Manis",
        description: "Gelang perak dengan desain manis dan nyaman dipakai",
        price: 3000,
        imageUrl: "/products/bracelet-1.jpg",
        category: "bracelets",
        featured: true,
        stock: 12
      }
    ];
    
    await Product.bulkCreate(products);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is run directly
if (require.main === module) {
seedDatabase();
}

module.exports = seedDatabase;
