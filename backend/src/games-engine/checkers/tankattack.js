module.exports = function ({ userAnswer }) {
  const score = Number(userAnswer?.score || 0);
  const survived = Boolean(userAnswer?.survived);
  return { correct: survived && score > 0, partialScore: score };
};
