const jwt = require('jsonwebtoken');

export function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function sendError(res, statusCode, message) {
  res.status(statusCode).json({ error: message });
}

export function sendSuccess(res, statusCode, data) {
  res.status(statusCode).json(data);
}
