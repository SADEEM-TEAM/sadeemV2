module.exports = function ({ correctAnswer, userAnswer }) {
  if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return { correct: false };
  if (userAnswer.length !== correctAnswer.length) return { correct: false };
  return { correct: userAnswer.every((v, i) => v === correctAnswer[i]) };
};
