const { Sequelize } = require('sequelize');
const path = require('path');

// Use Postgres (Neon) in production when DATABASE_URL is present; fallback to SQLite in development
const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (isProd && databaseUrl) {
  // Neon requires SSL
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  });
} else {
  // Local development with SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  });
}

module.exports = sequelize;
