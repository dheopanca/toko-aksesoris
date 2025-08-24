// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { 
        id: req.user.id,
        active: true
      },
      attributes: ['id', 'name', 'email', 'role', 'lastLogin', 'phone']
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

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const { name, description, price, category, imageUrl, featured, stock } = req.body;
    
    console.log('Received update data (backend):', req.body);

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate price and stock are numbers and non-negative
    const numPrice = Number(price);
    const numStock = Number(stock);

    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    
    if (isNaN(numStock) || numStock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative number' });
    }
    
    // Update product with validated data
    const updateData = {
      name,
      description,
      price: numPrice,
      category,
      imageUrl: imageUrl || product.imageUrl,
      featured: featured ?? product.featured,
      stock: numStock
    };

    console.log('Update data applied (backend):', updateData);
    
    await product.update(updateData);
    
    // Fetch updated product (optional but ensures correct data in response)
    const updatedProduct = await Product.findByPk(req.params.id);
    
    console.log('Product after update (backend):', updatedProduct);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
}; 