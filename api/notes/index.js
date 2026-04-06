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

    // Connect to DB
    await connectDB();

    if (req.method === 'GET') {
      // Get notes with optional filters
      const { week, month, year, startDate, endDate } = req.query;

      const filter = { userId };

      if (week && year) {
        filter.week = parseInt(week);
        filter.year = parseInt(year);
      } else if (month && year) {
        filter.month = parseInt(month);
        filter.year = parseInt(year);
      } else if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const notes = await Note.find(filter).sort({ date: -1 });

      return sendSuccess(res, 200, {
        count: notes.length,
        notes,
      });
    } else if (req.method === 'POST') {
      // Create note
      const { title, content, date, tags } = req.body;

      if (!title || !date) {
        return sendError(res, 400, 'Title and date are required');
      }

      const noteDate = new Date(date);
      const week = getWeekNumber(noteDate);
      const month = noteDate.getMonth() + 1;
      const noteYear = noteDate.getFullYear();

      const note = new Note({
        userId,
        title,
        content: content || '',
        date: noteDate,
        week,
        month,
        year: noteYear,
        tags: tags || [],
      });

      await note.save();

      return sendSuccess(res, 201, {
        message: 'Note created successfully',
        note,
      });
    } else {
      return sendError(res, 405, 'Method not allowed');
    }
  } catch (error) {
    console.error('Notes error:', error);
    return sendError(res, 500, 'Operation failed');
  }
}
