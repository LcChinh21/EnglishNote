const express = require('express');
const multer = require('multer');
const path = require('path');
const ocrController = require('../controllers/ocrController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Apply auth middleware
router.use(authMiddleware);

// Process OCR on image
router.post('/process', upload.single('image'), ocrController.processOCR);

// Upload image to note (without immediate OCR)
router.post('/upload', upload.single('image'), ocrController.uploadImageToNote);

// Get OCR result for specific image in a note
router.get('/:noteId/:imageIndex', ocrController.getOCRResult);

module.exports = router;
