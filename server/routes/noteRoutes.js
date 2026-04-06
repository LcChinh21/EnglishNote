const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create note
router.post('/', noteController.createNote);

// Get all notes (with optional filters)
router.get('/', noteController.getNotes);

// Search notes
router.get('/search', noteController.searchNotes);

// Get single note
router.get('/:id', noteController.getNote);

// Update note
router.put('/:id', noteController.updateNote);

// Delete note
router.delete('/:id', noteController.deleteNote);

module.exports = router;
