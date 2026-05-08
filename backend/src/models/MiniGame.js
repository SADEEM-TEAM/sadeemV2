const mongoose = require('mongoose');

const GAME_TYPES = [
  'quiz',
  'flashcard',
  'dragdrop',
  'arrowmatch',
  'imagepuzzle',
  'tankattack'
];

const MiniGameSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    gameType: { type: String, enum: GAME_TYPES, required: true },
    order: { type: Number, default: 0 },
    instructionAr: { type: String },
    instructionEn: { type: String },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    correctAnswer: { type: mongoose.Schema.Types.Mixed, select: false },
    xpReward: { type: Number, default: 10 },
    heartPenalty: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MiniGame', MiniGameSchema);
module.exports.GAME_TYPES = GAME_TYPES;
