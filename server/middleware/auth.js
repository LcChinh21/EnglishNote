const { verifyToken } = require('../config/auth');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message || 'Token verification failed' });
  }
};

module.exports = authMiddleware;
