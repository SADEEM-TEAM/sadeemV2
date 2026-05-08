function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayKey() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

exports.applyXp = async function (user, amount) {
  if (amount <= 0) return user;
  user.xp = (user.xp || 0) + amount;
  const today = todayKey();
  if (user.streakLastDay === today) {
    // already counted
  } else if (user.streakLastDay === yesterdayKey()) {
    user.streak = (user.streak || 0) + 1;
    user.streakLastDay = today;
  } else {
    user.streak = 1;
    user.streakLastDay = today;
  }
  await user.save();
  return user;
};
