// Vercel Serverless Function entry that forwards to the Express app
const app = require('../backend/index.js');

module.exports = (req, res) => {
  return app(req, res);
};
