const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const Note = require('../models/Note');

// Process OCR on uploaded image
exports.processOCR = async (req, res) => {
  let uploadedPath = null;
  let worker = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.user.userId;
    const noteId = req.body.noteId;
    uploadedPath = req.file.path;

    // Initialize Tesseract worker
    worker = await createWorker('eng');

    // Recognize text
    const result = await worker.recognize(uploadedPath);
    const extractedText = result.data.text;
    const confidence = result.data.confidence;

    // If noteId provided, add image to existing note
    if (noteId) {
      const note = await Note.findOne({ _id: noteId, userId });
      if (!note) {
        throw new Error('Note not found');
      }

      note.images.push({
        url: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        extractedText,
        ocrConfidence: confidence,
        processedAt: new Date(),
      });
      note.ocrProcessed = true;

      await note.save();
    }

    // Cleanup
    await worker.terminate();

    res.status(200).json({
      message: 'OCR processing completed',
      extractedText,
      confidence,
      imagePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error('OCR processing error:', error);
    
    // Cleanup worker if it exists
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        console.error('Worker termination error:', e);
      }
    }

    // Cleanup uploaded file
    if (uploadedPath && fs.existsSync(uploadedPath)) {
      fs.unlinkSync(uploadedPath);
    }

    res.status(500).json({ error: 'OCR processing failed: ' + error.message });
  }
};

// Upload image to note (without OCR - lazy processing)
exports.uploadImageToNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.user.userId;
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Add image to note without OCR
    note.images.push({
      url: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      uploadedAt: new Date(),
    });

    await note.save();

    res.status(200).json({
      message: 'Image uploaded successfully',
      image: note.images[note.images.length - 1],
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
};

// Get OCR result for image
exports.getOCRResult = async (req, res) => {
  let worker = null;

  try {
    const { noteId, imageIndex } = req.params;
    const userId = req.user.userId;

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const image = note.images[imageIndex];
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // If already processed, return cached result
    if (image.extractedText) {
      return res.status(200).json({
        extractedText: image.extractedText,
        confidence: image.ocrConfidence,
      });
    }

    // Process image
    const imagePath = path.join(__dirname, '../..', image.url);
    worker = await createWorker('eng');
    const result = await worker.recognize(imagePath);

    // Update image record
    image.extractedText = result.data.text;
    image.ocrConfidence = result.data.confidence;
    image.processedAt = new Date();
    await note.save();

    await worker.terminate();

    res.status(200).json({
      extractedText: result.data.text,
      confidence: result.data.confidence,
    });
  } catch (error) {
    console.error('Get OCR result error:', error);

    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        console.error('Worker termination error:', e);
      }
    }

    res.status(500).json({ error: 'Failed to get OCR result: ' + error.message });
  }
};
