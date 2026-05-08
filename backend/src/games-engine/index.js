const quiz = require('./checkers/quiz');
const flashcard = require('./checkers/flashcard');
const dragdrop = require('./checkers/dragdrop');
const arrowmatch = require('./checkers/arrowmatch');
const imagepuzzle = require('./checkers/imagepuzzle');
const tankattack = require('./checkers/tankattack');

const REGISTRY = { quiz, flashcard, dragdrop, arrowmatch, imagepuzzle, tankattack };

exports.check = function (gameType, payload, correctAnswer, userAnswer, lang = 'ar') {
  const checker = REGISTRY[gameType];
  if (!checker) throw new Error(`Unknown gameType: ${gameType}`);
  return checker({ payload, correctAnswer, userAnswer, lang });
};

exports.GAME_TYPES = Object.keys(REGISTRY);
