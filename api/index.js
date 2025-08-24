// Vercel Serverless Function entry that forwards to the Express app
const app = require('../backend/index.js');

module.exports = (req, res) => {
  // Remove '/api' prefix so Express routes like '/health', '/auth', etc. match
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  return app(req, res);
};
