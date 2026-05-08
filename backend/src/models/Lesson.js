const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['paragraph', 'callout', 'image', 'example', 'quote'],
      required: true
    },
    textAr: String,
    textEn: String,
    imageKey: String,
    accent: String
  },
  { _id: false }
);

const LessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    order: { type: Number, default: 0 },
    titleAr: { type: String, required: true },
    titleEn: { type: String },
    summaryAr: { type: String },
    illustrationKey: { type: String },
    contentBlocks: [BlockSchema],
    expectedReadMs: { type: Number, default: 25_000 },
    hintsAr: [String],
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    xpReward: { type: Number, default: 50 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', LessonSchema);
