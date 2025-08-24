const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      notEmpty: true,
      isValidAddress(value) {
        if (!value.street || !value.city || !value.postalCode || !value.province || !value.fullName || !value.phone) {
          throw new Error('Alamat harus memiliki street, city, postalCode, province, fullName, dan phone');
        }
      }
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number is required'
      },
      is: {
        args: [/^[0-9+\-\s()]+$/],
        msg: 'Invalid phone number format'
      },
      len: {
        args: [10, 15],
        msg: 'Phone number must be between 10 and 15 digits'
      }
    }
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    }
  ]
});

module.exports = Order;
