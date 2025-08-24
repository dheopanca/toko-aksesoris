// Catch-all Vercel Serverless Function to forward any /api/* route to the Express app
const app = require('../backend/index.js');

module.exports = (req, res) => {
  // Strip '/api' prefix so Express routes like '/health', '/products', etc. match
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  return app(req, res);
};
