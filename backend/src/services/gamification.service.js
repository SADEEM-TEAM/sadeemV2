const { GAMIFICATION_CONFIG, PROGRESSION_STATUSES, ACHIEVEMENTS } = require('../seed/data/gamification');

/**
 * Gamification Service
 * Handles XP calculations, heart management, streaks, and progression logic
 * Used by both backend API and frontend mock adapter
 */

class GamificationService {
  /**
   * Calculate XP earned for a game submission
   * @param {string} gameType - Type of game (quiz, flashcard, etc.)
   * @param {boolean} isCorrect - Whether answer was correct
   * @param {number} baseXp - Base XP reward from game config
   * @param {object} metadata - Additional metadata (multiplier, gotIt/total for flashcard, etc.)
   * @returns {number} XP earned
   */
  static calculateGameXp(gameType, isCorrect, baseXp, metadata = {}) {
    if (!isCorrect) return 0;

    let xp = baseXp || 10;

    // Game-specific bonus calculations
    switch (gameType) {
      case 'quiz':
        // Time-Rush quiz has multiplier for speed
        if (metadata.multiplier && typeof metadata.multiplier === 'number') {
          xp = Math.round(xp * metadata.multiplier);
        }
        break;

      case 'flashcard':
        // Self-grading flashcard: proportion of cards mastered
        if (metadata.gotIt !== undefined && metadata.total !== undefined) {
          const proportion = metadata.gotIt / Math.max(1, metadata.total);
          xp = Math.round(xp * proportion);
        }
        break;

      case 'tankattack':
        // Tank attack can have combo multiplier
        if (metadata.comboMultiplier && typeof metadata.comboMultiplier === 'number') {
          xp = Math.round(xp * metadata.comboMultiplier);
        }
        break;
    }

    return Math.max(0, xp);
  }

  /**
   * Get heart penalty for a game type
   * @param {string} gameType
   * @returns {number} Hearts to deduct on wrong answer
   */
  static getHeartPenalty(gameType) {
    return GAMIFICATION_CONFIG.heartPenalties[gameType] || 1;
  }

  /**
   * Calculate heart recovery based on time passed
   * @param {Date} lastHeartLossAt - Last time hearts were deducted
   * @param {number} currentHearts - Current heart count
   * @returns {number} Updated heart count
   */
  static calculateHeartRecovery(lastHeartLossAt, currentHearts) {
    const config = GAMIFICATION_CONFIG.streak.heartRecovery;
    if (!lastHeartLossAt || currentHearts >= config.maxHearts) {
      return config.maxHearts;
    }

    const msSinceLastLoss = Date.now() - new Date(lastHeartLossAt).getTime();
    const intervalMs = config.intervalHours * 60 * 60 * 1000;
    const recoveredHearts = Math.floor(msSinceLastLoss / intervalMs) * config.perInterval;

    return Math.min(config.maxHearts, currentHearts + recoveredHearts);
  }

  /**
   * Update streak based on daily activity
   * @param {string} streakLastDay - Last day user was active (YYYY-MM-DD)
   * @param {number} currentStreak - Current streak count
   * @returns {object} { streak: number, streakLastDay: string }
   */
  static updateStreak(streakLastDay, currentStreak) {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Streak continues if active today
    if (streakLastDay === today) {
      return { streak: currentStreak, streakLastDay: today };
    }

    // Streak breaks if missed a day
    if (streakLastDay !== yesterday) {
      return { streak: 1, streakLastDay: today };
    }

    // Streak continues (active yesterday, now today)
    return { streak: currentStreak + 1, streakLastDay: today };
  }

  /**
   * Check if a lesson progression gate is unlocked
   * @param {number} level - Lesson level
   * @param {object} stats - { completedCount, totalCount } for previous level
   * @returns {boolean}
   */
  static isLevelGateUnlocked(level, stats = {}) {
    // Level 1 always unlocked
    if (level === 1) return true;

    // Check 60% gate on previous level
    const gateConfig = GAMIFICATION_CONFIG.progressionGates[`level${level}`];
    if (!gateConfig) return false;

    const { completedCount = 0, totalCount = 0 } = stats;
    if (totalCount === 0) return false;

    const percentage = completedCount / totalCount;
    return percentage >= (gateConfig.gatePercentage || 0.6);
  }

  /**
   * Get lesson progression status
   * @param {object} options - { isCompleted, isPreviousLessonCompleted, isLevelGateOpen }
   * @returns {string} Status enum value
   */
  static getLessonStatus({ isCompleted, isPreviousLessonCompleted = true, isLevelGateOpen = true }) {
    if (!isLevelGateOpen) return PROGRESSION_STATUSES.LOCKED;
    if (isCompleted) return PROGRESSION_STATUSES.COMPLETED;
    if (isPreviousLessonCompleted) return PROGRESSION_STATUSES.UNLOCKED;
    return PROGRESSION_STATUSES.LOCKED;
  }

  /**
   * Check for newly earned achievements
   * @param {object} userStats - { xp, streak, completedLessons, perfectGames, maxCombo }
   * @param {array} existingAchievements - Already earned achievement IDs
   * @returns {array} Newly earned achievement IDs
   */
  static checkAchievements(userStats, existingAchievements = []) {
    const newAchievements = [];
    const hasAchievement = (id) => existingAchievements.includes(id);

    // First lesson
    if (!hasAchievement(ACHIEVEMENTS.FIRST_LESSON.id) && userStats.completedLessons >= 1) {
      newAchievements.push(ACHIEVEMENTS.FIRST_LESSON.id);
    }

    // Week streak
    if (!hasAchievement(ACHIEVEMENTS.WEEK_STREAK_7.id) && userStats.streak >= 7) {
      newAchievements.push(ACHIEVEMENTS.WEEK_STREAK_7.id);
    }

    // Perfect game (no errors in any game)
    if (!hasAchievement(ACHIEVEMENTS.PERFECT_GAME.id) && userStats.perfectGames >= 1) {
      newAchievements.push(ACHIEVEMENTS.PERFECT_GAME.id);
    }

    // Speed demon (multiplier >= 10)
    if (!hasAchievement(ACHIEVEMENTS.SPEED_DEMON.id) && userStats.maxCombo >= 10) {
      newAchievements.push(ACHIEVEMENTS.SPEED_DEMON.id);
    }

    return newAchievements;
  }

  /**
   * Get display name for an achievement
   * @param {string} achievementId
   * @returns {object} { titleAr, descAr }
   */
  static getAchievementDisplay(achievementId) {
    return Object.values(ACHIEVEMENTS).find((a) => a.id === achievementId) || null;
  }

  /**
   * Calculate total XP for a lesson based on all games
   * @param {array} games - Array of MiniGameDoc
   * @returns {number} Total XP reward
   */
  static calculateLessonTotalXp(games) {
    return games.reduce((sum, g) => sum + (g.xpReward || 10), 0);
  }
}

module.exports = GamificationService;
