const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    week: {
      type: Number,
      min: 1,
      max: 53,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
    },
    images: [
      {
        url: String,
        originalName: String,
        extractedText: String,
        ocrConfidence: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        processedAt: Date,
      },
    ],
    tags: [String],
    ocrProcessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
noteSchema.index({ userId: 1, date: 1 });
noteSchema.index({ userId: 1, week: 1, year: 1 });
noteSchema.index({ userId: 1, month: 1, year: 1 });
noteSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Note || mongoose.model('Note', noteSchema);
