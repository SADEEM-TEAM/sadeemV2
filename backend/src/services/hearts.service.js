const REGEN_INTERVAL_MS = 30 * 60 * 1000;
const MAX_HEARTS = 5;

exports.regenerateHearts = async function (user) {
  if (user.hearts >= MAX_HEARTS) return user;
  if (!user.lastHeartLossAt) return user;
  const elapsed = Date.now() - new Date(user.lastHeartLossAt).getTime();
  const regen = Math.floor(elapsed / REGEN_INTERVAL_MS);
  if (regen <= 0) return user;
  const before = user.hearts;
  user.hearts = Math.min(MAX_HEARTS, user.hearts + regen);
  if (user.hearts < MAX_HEARTS) {
    user.lastHeartLossAt = new Date(
      new Date(user.lastHeartLossAt).getTime() + regen * REGEN_INTERVAL_MS
    );
  } else {
    user.lastHeartLossAt = undefined;
  }
  if (user.hearts !== before) await user.save();
  return user;
};

exports.MAX_HEARTS = MAX_HEARTS;
