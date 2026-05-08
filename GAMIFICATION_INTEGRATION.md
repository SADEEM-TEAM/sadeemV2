# Gamification & Progression Integration Guide

## Overview

This project maintains **two parallel data layers**:
1. **Frontend Mock Data** - JSON/TS files for standalone demo without backend
2. **Backend Database** - MongoDB with seeded data for full-stack integration

Both layers use the same gamification logic and can switch seamlessly.

---

## Architecture

### Frontend Mock Layer (No Backend Required)

**Location**: `frontend/src/lib/`

Files:
- `mock-data.ts` - User, course, lesson, and game definitions
- `mock-adapter.ts` - Axios adapter intercepting API calls
- `mock-analytics.ts` - Demo analytics for dashboards

**Usage**:
```typescript
import { enableMockMode, resetMockState } from './lib/mock-adapter';

// Enable mock mode (stores state in localStorage)
enableMockMode(true);

// Reset to initial state
resetMockState();

// Disable and use real backend
enableMockMode(false);
```

**Persistence**: localStorage (`sadeen.mock.state`)

---

### Backend Database Layer

**Location**: `backend/src/`

**Models**:
- `User.js` - Student profiles with gamification stats (xp, hearts, streak)
- `Progress.js` - Lesson/game progress tracking
- `Lesson.js` - Lesson content
- `MiniGame.js` - Individual game specs
- `Course.js` - Course definitions

**Seed Files**: `backend/src/seed/data/`
- `courses.js` - Course definitions
- `history.js`, `math.js`, `coding.js` - Lesson/game packs
- `gamification.js` - XP rewards, heart penalties, progression gates
- `progression.js` - Initial progress states for demo users

---

## Gamification Config

### XP Rewards (per game type)

```javascript
// backend/src/seed/data/gamification.js
{
  quiz: { easy: 10, medium: 15, hard: 25, multiplier: 1.5 },
  flashcard: { easy: 5, medium: 8, hard: 12 },
  dragdrop: { easy: 8, medium: 12, hard: 20 },
  // ... more game types
}
```

**Frontend Integration** (mock-adapter.ts, line 276-284):
```javascript
if (game.gameType === 'quiz' && body?.answer?.multiplier) {
  const mult = Number(body.answer.multiplier) || 1;
  xpEarned = Math.round(game.xpReward * mult);
}
```

### Heart Penalties

```javascript
// Different games have different penalties:
quiz: 1,
tankattack: 2,  // Harder game
flashcard: 0    // Self-grading, no penalty
```

### Progression Gates

60% completion of Level N required to unlock Level N+1:

```javascript
levelGateOpen[lvl] = lvl === 1 ? true : prevPassed;
const percentage = done / total;
prevPassed = total > 0 && percentage >= 0.6;
```

---

## How to Seed the Database

### 1. Setup MongoDB

```bash
# Local development (no auth)
mongod --dbpath ./data
```

### 2. Run Seed Script

```bash
cd backend
npm install
npm run seed
```

What gets created:
- ✅ 3 Courses (History, Math, Coding)
- ✅ 12 Lessons (with games inside)
- ✅ ~50 MiniGames
- ✅ Demo student "كريم" with initial XP/hearts/streak
- ✅ Progress records (some lessons completed, one in-progress)
- ✅ Leaderboard students (Amin, Yasmine, Inas, Bilal)

### 3. Connect Frontend to Backend

In `frontend/src/lib/api.ts`:

```typescript
// Disable mock mode to use real API
enableMockMode(false);

// Your backend URL
const API = axios.create({
  baseURL: 'http://localhost:3000/api'
});
```

---

## Data Flow

### Game Submission Flow (Simplified)

```
Frontend Game Component
    ↓
POST /api/games/{gameId}/submit
    ↓
[Backend] Game submission controller
    ├─ Validate answer against correctAnswer field
    ├─ Calculate XP (using GamificationService)
    ├─ Update User.xp, User.hearts, User.streak
    ├─ Create/update Progress record
    └─ Return { correct, xpEarned, heartsLost, newStreak }
    ↓
Frontend receives response
    ├─ Update local state
    ├─ Show XP popup
    └─ Check for achievements
```

### With Mock Adapter (No Backend)

```
Frontend Game Component
    ↓
POST /api/games/{gameId}/submit (intercepted)
    ↓
[Mock Adapter] matches route, calls handler
    ├─ Load state from localStorage
    ├─ Find game in MOCK_LESSONS
    ├─ Validate answer (checkAnswer function)
    ├─ Calculate XP (same logic)
    ├─ Update state in localStorage
    └─ Return response
    ↓
Frontend receives response (identical)
```

---

## Key Services

### GamificationService (`backend/src/services/gamification.service.js`)

Used by both backend and frontend mock:

```javascript
// Calculate XP with multipliers
GamificationService.calculateGameXp(gameType, isCorrect, baseXp, metadata);

// Heart recovery (passive healing every 4 hours)
GamificationService.calculateHeartRecovery(lastHeartLossAt, currentHearts);

// Update daily streak
GamificationService.updateStreak(streakLastDay, currentStreak);

// Check progression gate (60% rule)
GamificationService.isLevelGateUnlocked(level, prevLevelStats);

// Award achievements
GamificationService.checkAchievements(userStats, existingAchievements);
```

---

## Frontend Mock Data Structure

### MOCK_USER

```typescript
{
  _id: 'mock-user-id',
  username: 'كريم',
  email: 'demo@sadeen.dz',
  xp: 120,           // ← Gamification
  hearts: 5,         // ← Gamification
  streak: 3,         // ← Gamification
  mascotPref: 'blue',
  onboarding: { completed: true, age: 12, ... }
}
```

### MOCK_LESSONS

Each lesson includes games with xpReward and heartPenalty:

```typescript
games: [
  {
    _id: 'g-history-L1-W0-0',
    gameType: 'flashcard',
    xpReward: 5,        // ← Gamification
    heartPenalty: 0,    // ← Gamification
    payload: { ... }
  },
  // more games
]
```

### Progress Tracking

Frontend mock-adapter maintains:

```javascript
interface MockState {
  user: AuthUser,
  completedLessons: string[],      // ← Lesson IDs
  errorsByGame: Record<string, number>,  // ← Error counts per game
  readReceipts: Record<string, number>,  // ← Read timestamps
  dailyChallengesClaimed?: Record<string, string[]>
}
```

Backend Progress model:

```javascript
{
  userId, courseId, lessonId,
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed',
  bestScore: number,
  errorsByGame: Map<gameId, errorCount>,
  readReceiptIssuedAt: Date,
  completedAt: Date
}
```

---

## Testing Gamification

### Test with Mock (No Backend)

```bash
# 1. Enable mock mode (via DevTools console)
localStorage.setItem('sadeen.mock', '1');

# 2. Reload browser
# 3. Play games, check XP/hearts/streak updates
# 4. Inspect state
localStorage.getItem('sadeen.mock.state') // full state
```

### Test with Database

```bash
# 1. Start MongoDB
mongod --dbpath ./data

# 2. Seed database
cd backend && npm run seed

# 3. Start backend
npm start

# 4. Disable mock in frontend
localStorage.removeItem('sadeen.mock');

# 5. Test real API calls
```

---

## Extending Gamification

### Add New Game Type

1. **Add to enum** (`MiniGame.js`):
```javascript
const GAME_TYPES = ['quiz', ..., 'mynewgame'];
```

2. **Configure rewards** (`gamification.js`):
```javascript
xpRewards: { mynewgame: { easy: 10, medium: 15, hard: 25 } },
heartPenalties: { mynewgame: 1 }
```

3. **Add scoring logic** (`mock-adapter.ts`, `checkAnswer`):
```javascript
if (gameType === 'mynewgame') {
  // Custom validation
}
```

4. **Update mock and seed** with sample games

### Add Achievement

1. Define in `gamification.js`:
```javascript
ACHIEVEMENTS: {
  MY_ACHIEVEMENT: { id: 'my_ach', titleAr: '...', descAr: '...' }
}
```

2. Add check in `GamificationService.checkAchievements()`:
```javascript
if (!hasAchievement(ACHIEVEMENTS.MY_ACHIEVEMENT.id) && condition) {
  newAchievements.push(ACHIEVEMENTS.MY_ACHIEVEMENT.id);
}
```

3. Listen in frontend:
```typescript
const newAchievements = GamificationService.checkAchievements(...);
if (newAchievements.length) showAchievementNotification(newAchievements);
```

---

## Migration: Mock → Database

When switching from mock to real backend:

1. **User state** persists in database (xp, hearts, streak)
2. **Progress records** migrate automatically (POST /api/progress endpoints)
3. **Gamification logic** is identical (same service used)
4. **localStorage state** can be cleared (no longer needed)

```javascript
// Migration script
const mockState = JSON.parse(localStorage.getItem('sadeen.mock.state'));
// POST /api/progress/batch to create records
// PATCH /api/users/me to update xp/hearts/streak
```

---

## File Reference

```
frontend/
├── src/lib/
│   ├── mock-data.ts          ← MOCK_USER, MOCK_COURSES, MOCK_LESSONS
│   ├── mock-adapter.ts       ← Axios interceptor, game submission logic
│   ├── mock-analytics.ts     ← Deterministic student/admin data
│   └── types.ts              ← Type definitions

backend/
├── src/
│   ├── models/
│   │   ├── User.js           ← xp, hearts, streak, achievements
│   │   ├── Progress.js       ← Lesson/game completion tracking
│   │   ├── Lesson.js         ← Lesson content
│   │   ├── MiniGame.js       ← Individual games
│   │   └── Course.js         ← Courses
│   │
│   ├── seed/
│   │   ├── index.js          ← Main seed script
│   │   └── data/
│   │       ├── courses.js
│   │       ├── history.js, math.js, coding.js
│   │       ├── gamification.js      ← XP/heart/achievement config
│   │       └── progression.js       ← Demo user progress states
│   │
│   ├── services/
│   │   ├── gamification.service.js  ← XP/heart/streak logic (shared)
│   │   ├── hearts.service.js
│   │   └── xp.service.js
│   │
│   └── modules/
│       ├── progress/
│       │   ├── progress.routes.js
│       │   └── progress.controller.js
│       ├── games/
│       │   ├── games.routes.js
│       │   └── games.controller.js
│       └── ...
```

---

## Demo Usage

### With Mock (Default for Dev)

```bash
cd frontend
npm install
npm run dev
# Automatically uses localStorage mock
# No backend required
# Full functionality for testing
```

### With Backend

```bash
# Terminal 1: Start MongoDB + Backend
cd backend
npm run seed
npm start

# Terminal 2: Start Frontend
cd frontend
npm run dev
# Disable mock mode in console or config
```

---

## Troubleshooting

### Mock data not persisting

- Clear localStorage: `localStorage.clear()`
- Re-enable mock: `localStorage.setItem('sadeen.mock', '1')`
- Hard reload: `Ctrl+Shift+R`

### Backend API 404 errors

- Check mock mode: `localStorage.getItem('sadeen.mock')`
- Ensure backend running: `curl http://localhost:3000/api/courses`
- Check CORS settings if using remote backend

### XP not calculating correctly

- Check game metadata in POST body (multiplier, gotIt/total)
- Verify `checkAnswer` returns true (correct answer)
- Check `GAMIFICATION_CONFIG` XP values

### Progression gates not working

- Ensure Progress records created (check MongoDB)
- Calculate percentage: `completedCount / totalCount >= 0.6`
- Check `isLevelGateUnlocked()` logic for level 1 override

---

## Next Steps

- [ ] Implement real progress endpoints (POST /api/progress)
- [ ] Add progress persistence to database
- [ ] Create admin API for progress management
- [ ] Build teacher dashboard using progression data
- [ ] Add real-time progress WebSocket updates
- [ ] Implement achievement notifications
- [ ] Add leaderboard API with real user data
