// Forward all API requests to the main Express app
const { createServer } = require('http');
const express = require('express');
const app = require('../backend/index');

const serverless = express();

// Apply CORS middleware
serverless.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Mount the main app
serverless.use('/', app);

// Export the serverless function
module.exports = serverless;
