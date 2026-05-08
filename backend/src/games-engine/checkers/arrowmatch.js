module.exports = function ({ correctAnswer, userAnswer }) {
  if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return { correct: false };
  if (userAnswer.length !== correctAnswer.length) return { correct: false };
  const norm = (a) =>
    a.map((p) => `${p.from}->${p.to}`).sort();
  const u = norm(userAnswer);
  const c = norm(correctAnswer);
  return { correct: u.every((v, i) => v === c[i]) };
};
