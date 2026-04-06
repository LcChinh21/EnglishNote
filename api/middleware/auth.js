import { verifyToken, sendError } from '../utils/auth.js';

export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return sendError(res, 401, 'No authorization token provided');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return sendError(res, 401, 'Invalid token format');
      }

      const decoded = verifyToken(token);
      req.user = decoded;
      
      return handler(req, res);
    } catch (error) {
      return sendError(res, 401, error.message || 'Token verification failed');
    }
  };
}
