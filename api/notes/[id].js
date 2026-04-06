import { connectDB } from '../../utils/db.js';
import Note from '../../utils/Note.js';
import { verifyToken, sendError, sendSuccess } from '../../utils/auth.js';

// Helper function to calculate week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

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
    const { id } = req.query;

    await connectDB();

    if (req.method === 'GET') {
      // Get single note
      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        return sendError(res, 404, 'Note not found');
      }
      return sendSuccess(res, 200, note);
    } else if (req.method === 'PUT') {
      // Update note
      const { title, content, tags, date } = req.body;

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        return sendError(res, 404, 'Note not found');
      }

      if (title) note.title = title;
      if (content !== undefined) note.content = content;
      if (tags) note.tags = tags;
      if (date) {
        const noteDate = new Date(date);
        note.date = noteDate;
        note.week = getWeekNumber(noteDate);
        note.month = noteDate.getMonth() + 1;
        note.year = noteDate.getFullYear();
      }

      await note.save();

      return sendSuccess(res, 200, {
        message: 'Note updated successfully',
        note,
      });
    } else if (req.method === 'DELETE') {
      // Delete note
      const note = await Note.findOneAndDelete({ _id: id, userId });
      if (!note) {
        return sendError(res, 404, 'Note not found');
      }

      return sendSuccess(res, 200, { message: 'Note deleted successfully' });
    } else {
      return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Note operation error:', error);
    return sendError(res, 500, 'Operation failed');
  }
}
