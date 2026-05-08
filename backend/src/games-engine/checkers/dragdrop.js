module.exports = function ({ correctAnswer, userAnswer }) {
  if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return { correct: false };
  if (userAnswer.length !== correctAnswer.length) return { correct: false };
  const norm = (a) => a.map((p) => `${p[0]}:${p[1]}`).sort();
  const u = norm(userAnswer);
  const c = norm(correctAnswer);
  const correct = u.every((v, i) => v === c[i]);
  return { correct };
};
