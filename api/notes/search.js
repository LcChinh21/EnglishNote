import { connectDB } from '../../utils/db.js';
import Note from '../../utils/Note.js';
import { verifyToken, sendError, sendSuccess } from '../../utils/auth.js';

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

  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method not allowed');
  }

  try {
    // Verify token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendError(res, 401, 'No authorization token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 401, 'Invalid token format');
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return sendError(res, 401, error.message);
    }

    const userId = decoded.userId;
    const { q } = req.query;

    if (!q) {
      return sendError(res, 400, 'Search query is required');
    }

    await connectDB();

    const notes = await Note.find({
      userId,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    }).sort({ date: -1 });

    return sendSuccess(res, 200, {
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error('Search error:', error);
    return sendError(res, 500, 'Search failed');
  }
}
