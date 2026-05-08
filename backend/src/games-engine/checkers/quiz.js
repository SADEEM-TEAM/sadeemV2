module.exports = function ({ correctAnswer, userAnswer }) {
  return { correct: Number(userAnswer) === Number(correctAnswer) };
};
