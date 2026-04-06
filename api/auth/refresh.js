import { generateAccessToken, verifyToken, sendError, sendSuccess } from '../utils/auth.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 400, 'Refresh token is required');
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    // Generate new access token
    const accessToken = generateAccessToken(decoded.userId);

    return sendSuccess(res, 200, {
      message: 'Token refreshed successfully',
      accessToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return sendError(res, 401, 'Invalid refresh token');
  }
}
