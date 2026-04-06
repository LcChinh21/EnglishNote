const Note = require('../models/Note');

// Helper function to calculate week number
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Create note
exports.createNote = async (req, res) => {
  try {
    const { title, content, date, tags } = req.body;
    const userId = req.user.userId;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const noteDate = new Date(date);
    const week = getWeekNumber(noteDate);
    const month = noteDate.getMonth() + 1;
    const year = noteDate.getFullYear();

    const note = new Note({
      userId,
      title,
      content,
      date: noteDate,
      week,
      month,
      year,
      tags: tags || [],
    });

    await note.save();

    res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// Get all notes for user
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { week, month, year, startDate, endDate } = req.query;

    const filter = { userId };

    // Apply filters
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

    res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Get single note
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, content, tags, date } = req.body;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Update fields
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (date) {
      const noteDate = new Date(date);
      note.date = noteDate;
      note.week = getWeekNumber(noteDate);
      note.month = noteDate.getMonth() + 1;
      note.year = noteDate.getFullYear();
    }

    await note.save();

    res.status(200).json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const note = await Note.findOneAndDelete({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

// Search notes
exports.searchNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const notes = await Note.find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    }).sort({ date: -1 });

    res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
};
