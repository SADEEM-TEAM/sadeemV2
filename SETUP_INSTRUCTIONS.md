# Setup Instructions: Mock Data + Gamification + Database Integration

## What You Get

✅ **Fully Working Demo** (no backend required)
- All 3 courses with 12 lessons loaded
- ~50 games with scoring and progression
- Gamification system (XP, hearts, streak)
- Demo user with progress history
- Leaderboard with real students
- Teacher/parent/admin dashboards
- Persistent state in localStorage

✅ **Production-Ready Database** (optional)
- MongoDB seed with all content
- Gamification config (rewards, penalties)
- Progress tracking system
- User authentication ready
- Easy switch between mock ↔ database

✅ **Shared Game Logic**
- Same scoring calculations in mock and backend
- Unified gamification service
- Identical progression rules
- No code changes when switching modes

---

## Quick Start (5 minutes)

### Option A: Demo Only (No Backend)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:5173

# 5. Auto-uses mock data from localStorage
# Ready to play!
```

**That's it!** The app is fully functional with mock data.

### Option B: With Database

```bash
# Terminal 1: Start MongoDB
mongod --dbpath ./data

# Terminal 2: Seed database
cd backend
npm install
npm run seed

# Terminal 3: Start backend API
npm start

# Terminal 4: Start frontend
cd frontend
npm run dev
# Then disable mock: localStorage.removeItem('sadeen.mock')
```

---

## File Structure

```
project/
├── GAMIFICATION_INTEGRATION.md          ← Architecture guide (READ THIS FIRST)
├── MOCK_DATA_QUICK_REFERENCE.md         ← Data reference
├── USING_MOCK_DATA_IN_COMPONENTS.md    ← Developer guide
├── SETUP_INSTRUCTIONS.md                ← This file
│
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── mock-data.ts             ← All courses/lessons/games
│   │   │   ├── mock-adapter.ts          ← Axios interceptor (game logic)
│   │   │   ├── mock-analytics.ts        ← Dashboard stats
│   │   │   └── api.ts                   ← API client
│   │   └── app/
│   │       ├── games/                   ← Game components
│   │       ├── courses/                 ← Course/lesson components
│   │       └── dashboards/              ← Analytics dashboards
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── models/
    │   │   ├── User.js                  ← Gamification fields (xp, hearts, streak)
    │   │   ├── Progress.js              ← Lesson/game progress
    │   │   ├── Lesson.js
    │   │   ├── MiniGame.js
    │   │   └── Course.js
    │   │
    │   ├── services/
    │   │   ├── gamification.service.js  ← Shared game logic
    │   │   ├── hearts.service.js
    │   │   └── xp.service.js
    │   │
    │   ├── seed/
    │   │   ├── index.js                 ← Seed runner
    │   │   └── data/
    │   │       ├── courses.js           ← 3 courses
    │   │       ├── history.js           ← Content + games
    │   │       ├── math.js
    │   │       ├── coding.js
    │   │       ├── gamification.js      ← XP/heart/achievement config
    │   │       ├── progression.js       ← Demo user progression
    │   │       └── users.js
    │   │
    │   ├── modules/
    │   │   ├── games/
    │   │   │   ├── games.controller.js  ← Game submission logic
    │   │   │   └── games.routes.js
    │   │   ├── progress/
    │   │   │   ├── progress.controller.js
    │   │   │   └── progress.routes.js
    │   │   ├── courses/
    │   │   ├── lessons/
    │   │   └── ...
    │   │
    │   └── app.js
    └── package.json
```

---

## Key Features Explained

### 1. Mock Adapter (Frontend)

**File**: `frontend/src/lib/mock-adapter.ts`

What it does:
- Intercepts all axios requests
- Routes to handlers based on URL pattern
- Returns identical responses as backend
- Stores state in localStorage

No changes needed - works automatically when mock mode enabled.

### 2. Gamification System

**Core Logic**: 
- XP rewards on correct answers (game-type specific)
- Heart penalties on wrong answers
- Streak tracking (daily activity)
- Progression gates (60% to unlock next level)
- Achievements (unlocked by milestones)

**Locations**:
- Frontend mock: `mock-adapter.ts` line 270-305 (game submission)
- Backend: `gamification.service.js` (reusable functions)
- Config: `seed/data/gamification.js` (all constants)

### 3. Progress Tracking

**Frontend Mock**:
```javascript
completedLessons: ['l-history-L1-W0', 'l-history-L1-W1', ...]
errorsByGame: { 'g-history-L1-W0-0': 2, ... }
```

**Database**:
```javascript
// Progress model
{
  userId, courseId, lessonId,
  status: 'completed' | 'in_progress' | 'locked' | 'unlocked',
  bestScore, errorsByGame, completedAt
}
```

### 4. Progression Gates

**Rule**: 60% of Level N required to unlock Level N+1

```
Level 1: ALWAYS UNLOCKED
Level 2: Unlocked when 60% (2.4/4 lessons) of Level 1 completed
Level 3: Unlocked when 60% of Level 2 completed
Level 4: Unlocked when 60% of Level 3 completed
```

**Implementation**: 
- Frontend: `mock-adapter.ts` line 194-209
- Backend: `GamificationService.isLevelGateUnlocked()`

---

## Data Flow

### Game Submission (Same for Mock & Database)

```
User plays game → Selects answer → Clicks submit

    ↓

POST /api/games/{gameId}/submit
  { answer: [...] }

    ↓

[Mock Adapter OR Backend]
  1. Find game in games list
  2. Validate answer against correct answer
  3. Calculate XP using GamificationService
  4. Deduct hearts if wrong
  5. Update streak
  6. Save state (localStorage OR database)
  
    ↓

Response:
{
  correct: boolean,
  xpEarned: number,
  heartsLost: number,
  hearts: number,          // Current hearts after this game
  maxHearts: 5,
  xp: number,              // User's total XP
  errors: number           // Total errors in this game
}

    ↓

Frontend displays:
- "Correct!" or "Try again"
- XP popup: "+15"
- Heart visual update
- Progress check
- Achievement notification (if earned)
```

---

## What's Mocked vs Real

### Fully Mocked (Demo Mode)

✅ Game submissions (scoring, XP, hearts)
✅ Progress tracking (lesson completion)
✅ User profile (xp, hearts, streak)
✅ Leaderboard (top 5 students)
✅ Courses & lessons (all content)
✅ Daily challenges (deterministic by date)
✅ Analytics dashboards (seeded data)

### Requires Backend

- User authentication (real credentials, JWT)
- Persistent database storage
- Real-time multiplayer
- Teacher assignment & grading
- Parent notifications
- Analytics aggregation

---

## Configuration

### Enable/Disable Mock Mode

```javascript
// In browser console or component
import { enableMockMode, isMockMode } from '@/lib/mock-adapter';

// Check current mode
console.log(isMockMode()); // true if mock, false if backend

// Switch to mock
enableMockMode(true);

// Switch to backend
enableMockMode(false);

// Reset mock state to defaults
localStorage.removeItem('sadeen.mock.state');
```

### Customize Mock Data

Edit these files:

1. **Demo User** → `frontend/src/lib/mock-data.ts` line 13-23
   ```typescript
   export const MOCK_USER: AuthUser = {
     username: 'كريم',
     xp: 120,
     hearts: 5,
     // ...
   };
   ```

2. **Game XP Rewards** → `backend/src/seed/data/gamification.js`
   ```javascript
   xpRewards: {
     quiz: { easy: 10, medium: 15, hard: 25 }
     // Adjust values
   }
   ```

3. **Lesson Content** → `backend/src/seed/data/history.js` (etc.)
   ```javascript
   lessons: [
     {
       lesson: { titleAr: '...', contentBlocks: [...] },
       games: [...]
     }
   ]
   ```

4. **Progression Gates** → `backend/src/seed/data/gamification.js`
   ```javascript
   progressionGates: {
     level2: { gatePercentage: 0.6 } // Change from 60% to other
   }
   ```

---

## Testing

### Test Mock Mode

```bash
# 1. Enable mock (automatic on fresh install)
# 2. Open DevTools console
localStorage.setItem('sadeen.mock', '1');

# 3. Reload page
# 4. Try these:
# - Complete a lesson
# - Submit game answers
# - Check leaderboard
# - View analytics
# - Check XP/hearts update
```

### Test Backend Mode

```bash
# 1. Start MongoDB
mongod --dbpath ./data

# 2. Seed
cd backend && npm run seed

# 3. Start backend
npm start

# 4. In frontend console
localStorage.removeItem('sadeen.mock');

# 5. Reload and test
# - Check API calls in Network tab
# - Verify data persists across sessions
# - Check database with MongoDB Compass
```

### Run Tests

```bash
# Frontend unit tests
cd frontend
npm test

# Backend tests (if configured)
cd backend
npm test
```

---

## Common Issues

### Issue: Mock data not appearing

**Solution**:
```javascript
// Check if mock enabled
localStorage.getItem('sadeen.mock'); // Should be '1'

// Enable if needed
localStorage.setItem('sadeen.mock', '1');

// Reset state
localStorage.removeItem('sadeen.mock.state');

// Reload
location.reload();
```

### Issue: Backend API returns 404

**Possible causes**:
1. Mock mode still enabled → `localStorage.removeItem('sadeen.mock')`
2. Backend not running → `npm start` in backend directory
3. Wrong API URL → Check `API.defaults.baseURL` in `src/lib/api.ts`
4. Route doesn't exist → Check backend routes in `modules/*/routes.js`

### Issue: XP not calculating correctly

**Check**:
1. Is game type handled in `checkAnswer()`? (mock-adapter.ts line 528-575)
2. Is `xpReward` set in game config?
3. Did answer submit return `correct: true`?
4. Check `GAMIFICATION_CONFIG.xpRewards` for game type

### Issue: Database seed fails

**Solutions**:
```bash
# 1. Ensure MongoDB running
mongod --dbpath ./data

# 2. Check MONGO_URI
echo $MONGO_URI  # or check .env

# 3. Verify models exist
ls backend/src/models/

# 4. Clear old data and reseed
mongo
> use sadeen
> db.dropDatabase()
# Then npm run seed again
```

---

## Next Steps

### For Development

1. **Read** `GAMIFICATION_INTEGRATION.md` - Architecture overview
2. **Explore** `frontend/src/lib/mock-data.ts` - All content here
3. **Understand** `frontend/src/lib/mock-adapter.ts` - Game logic here
4. **Reference** `MOCK_DATA_QUICK_REFERENCE.md` - Quick lookup
5. **Build** new components using `/lib/api` functions

### For Production

1. **Setup** MongoDB (production instance)
2. **Deploy** backend (API server)
3. **Disable** mock mode in frontend
4. **Configure** authentication (real JWT)
5. **Enable** databases in all services

### For Extending

1. **Add course** → Update `seed/data` files
2. **Add game type** → Update enum + `mock-adapter.ts` + `checkAnswer()`
3. **Add achievement** → Update `gamification.js` + `GamificationService`
4. **Add feature** → Use `/lib/api` for all requests

---

## Architecture Decisions

**Why two data layers?**
- Speed: Demo fully functional without backend setup
- Flexibility: Develop frontend independently
- Testing: Deterministic mock data for consistency
- Migration: Seamless switch when ready

**Why unify game logic?**
- Consistency: Same XP calc frontend and backend
- Maintainability: Change logic in one place
- Correctness: Server validates client submissions

**Why localStorage for mock?**
- Simplicity: No server needed
- Realism: State persists across sessions
- Testability: Inspect state in DevTools

---

## Support

### Documentation Files

- **GAMIFICATION_INTEGRATION.md** - Complete architecture
- **MOCK_DATA_QUICK_REFERENCE.md** - Data reference + examples
- **USING_MOCK_DATA_IN_COMPONENTS.md** - Developer guide
- **SETUP_INSTRUCTIONS.md** - This file

### Code Comments

Key locations with inline docs:
- `backend/src/services/gamification.service.js` - JSDoc comments
- `backend/src/seed/data/gamification.js` - Config with comments
- `frontend/src/lib/mock-data.ts` - Type exports with docs

### Debugging

```javascript
// Enable verbose logging
localStorage.setItem('sadeen.debug', '1');

// Inspect mock state
JSON.parse(localStorage.getItem('sadeen.mock.state'))

// Check mock mode
localStorage.getItem('sadeen.mock')

// View all localStorage
Object.keys(localStorage).forEach(k => {
  console.log(k, localStorage.getItem(k));
});
```

---

## Summary

🎯 **Get started in 5 minutes** with full working demo  
🗄️ **Optionally add database** for persistence  
🎮 **Unified gamification logic** frontend and backend  
📚 **Comprehensive documentation** included  
✅ **Production-ready** when you need it  

**Start here**: `npm run dev` in frontend directory. Everything else is optional!

---

Last updated: May 8, 2026
Made for Sadeen Hackathon Project
