const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nama tidak boleh kosong'
      },
      len: {
        args: [2, 50],
        msg: 'Nama harus antara 2 sampai 50 karakter'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Email tidak boleh kosong'
      },
      isEmail: {
        msg: 'Format email tidak valid'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password tidak boleh kosong'
      },
      len: {
        args: [6, 100],
        msg: 'Password harus minimal 6 karakter'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: [/^[0-9+\-\s()]+$/],
        msg: 'Format nomor telepon tidak valid'
      },
      len: {
        args: [10, 15],
        msg: 'Nomor telepon harus antara 10 sampai 15 digit'
      }
    }
  },
  addressStreet: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressCity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressProvince: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressPostalCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Method to check password
User.prototype.comparePassword = async function(candidatePassword) {
  try {
  return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Class method untuk login berdasarkan email (untuk user biasa)
User.loginByEmail = async function(email, password) {
  try {
    if (!email || !password) {
      throw new Error('Email dan password harus diisi');
    }

    const user = await this.findOne({ where: { email, active: true } });

    if (!user) {
      throw new Error('Email atau password tidak valid');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Email atau password tidak valid');
    }

    user.lastLogin = new Date();
    await user.save();

    return user;
  } catch (error) {
    console.error('Login by email error in User model:', error);
    throw error;
  }
};

// Class method untuk login (hanya username)
User.login = async function(username, password) {
  try {
    if (!username || !password) {
      throw new Error('Username dan password harus diisi');
    }

    // Cari user berdasarkan name (dipakai sebagai username)
    const user = await this.findOne({ where: { name: username, active: true } });

    if (!user) {
      throw new Error('Username atau password tidak valid');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Username atau password tidak valid');
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    return user;
  } catch (error) {
    console.error('Login error in User model:', error);
    throw error;
  }
};

module.exports = User;
