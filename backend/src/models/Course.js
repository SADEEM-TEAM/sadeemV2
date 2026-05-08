const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    topic: { type: String, enum: ['history', 'math', 'coding'], required: true },
    titleAr: { type: String, required: true },
    titleEn: { type: String },
    descriptionAr: { type: String },
    descriptionEn: { type: String },
    iconKey: { type: String },
    illustrationKey: { type: String },
    accent: {
      hue: String,
      gradient: [String]
    },
    gradeRange: { min: Number, max: Number },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
