# 🎮 Gamification & Mock Data System

Welcome! This project has a **fully integrated gamification system** with **optional database backend**. Start developing immediately without setup overhead.

## 📋 Start Here

1. **New to the project?** → Read [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) (5 min)
2. **Need architecture overview?** → Read [GAMIFICATION_INTEGRATION.md](./GAMIFICATION_INTEGRATION.md)
3. **Building components?** → Read [USING_MOCK_DATA_IN_COMPONENTS.md](./USING_MOCK_DATA_IN_COMPONENTS.md)
4. **Quick reference?** → Use [MOCK_DATA_QUICK_REFERENCE.md](./MOCK_DATA_QUICK_REFERENCE.md)

## 🚀 Quick Start (Choose One)

### Option 1: Demo Mode (No Backend)

```bash
cd frontend
npm install
npm run dev
# Ready to play! All data in localStorage.
```

✅ Fully functional  
✅ No setup required  
✅ All games working  
✅ Progress tracking  
✅ Gamification system  

### Option 2: With Database

```bash
# Terminal 1: Start MongoDB
mongod --dbpath ./data

# Terminal 2: Backend
cd backend && npm install && npm run seed && npm start

# Terminal 3: Frontend
cd frontend && npm run dev
```

✅ Everything from Option 1  
✅ Persistent database  
✅ Real authentication  
✅ Multi-user support  

## 📊 What's Included

### Courses & Content
- 3 Courses: History, Math, Coding
- 12 Lessons: 4 per course, 4 difficulty levels
- 50+ Games: 6 game types with different mechanics
- Full Arabic content with illustrations

### Gamification System
- **XP Rewards**: 5-40 per game, 50-150 per lesson
- **Hearts**: 5 max, penalties 0-2 per wrong answer
- **Streaks**: Daily consistency tracking
- **Progression**: 60% gate between levels
- **Achievements**: 6 milestone badges
- **Daily Challenges**: 5 unique, 3 per day rotation

### Demo Users
- 1 playable demo student (كريم) with 120 XP
- 4 leaderboard students (fully seeded)
- Teacher account with student roster
- Parent account with 2 kids

### Dashboards
- Student: Course/lesson roadmap, game playing
- Leaderboard: Top 5 students by XP
- Teacher: Class overview, student progress
- Parent: Kids' activity, weekly stats
- Admin: Platform overview, analytics

## 📂 Key Files

### Frontend Mock Data

```
frontend/src/lib/
├── mock-data.ts              ← Courses, lessons, games (12 + 50+)
├── mock-adapter.ts           ← Game logic, scoring, XP calculation
├── mock-analytics.ts         ← Dashboard data (deterministic)
└── api.ts                    ← API client (works with mock or real)
```

### Backend Services & Seed

```
backend/src/
├── services/
│   └── gamification.service.js    ← Shared game math
├── seed/
│   ├── index.js                   ← Seed runner
│   └── data/
│       ├── gamification.js        ← XP, hearts, achievement config
│       ├── progression.js         ← Demo user progression
│       └── {history,math,coding}.js
└── models/
    ├── User.js                    ← xp, hearts, streak, achievements
    └── Progress.js                ← Lesson/game tracking
```

## 🎮 Gamification Details

### XP System

**Per Game** (correct answer):
- Easy: 5-15 XP
- Medium: 8-25 XP
- Hard: 12-40 XP
- Bonus: Time-Rush multipliers (1.5×)

**Per Lesson** (completion):
- Level 1: +50 XP
- Level 2: +75 XP
- Level 3: +100 XP
- Level 4: +150 XP

**Daily Challenges**:
- Math Minute: 30 XP
- History Flash: 25 XP
- Code Quest: 30 XP
- Combo Master: 35 XP
- Quiz Streak: 40 XP

### Hearts System

- Max: 5 hearts
- Penalties: 1-2 per game type
- Recovery: 1 heart every 4 hours
- Loss: Losing all hearts locks gameplay
- Flashcard: No penalty (self-grading)
- Tank Attack: 2 penalty (harder game)

### Progression Gates

```
Level 1: ALWAYS unlocked
Level 2: 60% of Level 1 lessons completed
Level 3: 60% of Level 2 lessons completed
Level 4: 60% of Level 3 lessons completed
```

Completion = finish lesson with all games.

### Streak System

- Increments: +1 for daily activity
- Resets: 0 if miss a day
- Bonus: Visual indicator + leaderboard advantage
- Display: 🔥 X days

### Achievements

- First Lesson: Complete lesson 1
- Week Streak 7: Maintain 7-day streak
- Perfect Game: Win with 0 errors
- Speed Demon: 10× combo multiplier
- Level Master: Complete entire level
- Course Master: Complete entire course

## 🔄 Mock vs Database

### Mock Mode (Default)

Runs entirely in browser, no backend needed:
- localStorage stores state
- Axios interceptor handles all requests
- Deterministic seeding for dashboards
- Perfect for development/demo

```javascript
enableMockMode(true);  // in browser console
```

### Database Mode

Uses MongoDB + Node backend for persistence:
- Real user authentication
- Multi-user support
- Analytics aggregation
- Production-ready

```javascript
enableMockMode(false);  // disable mock
```

**Key point**: Switch between them with ONE LINE. All game logic is identical.

## 🧪 Testing

### Test with Mock

```bash
# Auto-enabled on fresh install
cd frontend && npm run dev
# Play games, check XP/hearts/streak update
# Inspect localStorage in DevTools
```

### Test with Database

```bash
# 1. Start backend
cd backend && npm run seed && npm start

# 2. Disable mock in browser
localStorage.removeItem('sadeen.mock');

# 3. Reload and test
# All APIs now hit MongoDB backend
```

## 📖 Architecture

### Data Flow

```
Game Submission
  ↓
POST /api/games/{id}/submit
  ↓
[Axios Request (real or intercepted)]
  ↓
[Mock Adapter] OR [Backend Controller]
  ├─ Validate answer
  ├─ Calculate XP (GamificationService)
  ├─ Update hearts/streak
  ├─ Check achievements
  └─ Return response
  ↓
Response (identical either way)
  {
    correct: boolean,
    xpEarned: number,
    heartsLost: number,
    hearts: number,
    maxHearts: 5,
    xp: number,
    errors: number
  }
  ↓
Frontend updates UI + shows rewards
```

### Shared Logic

Same `GamificationService` used in:
- Frontend mock-adapter (JavaScript)
- Backend API controllers (Node.js)

This ensures **identical behavior** regardless of backend.

## 🛠️ Development

### Component Pattern

All components use the standard API:

```typescript
import { submitGameAnswer, getCourses } from '@/lib/api';

// Works the SAME with mock or real backend
const result = await submitGameAnswer(gameId, answer);
const courses = await getCourses();
```

No code changes needed when switching modes.

### Add New Content

1. **Add Lesson**: Edit seed data files, rerun seed
2. **Add Game**: Define spec in lesson, add answer validation
3. **Add Achievement**: Define config, add check logic
4. **Add Challenge**: Add to daily challenges array

See [GAMIFICATION_INTEGRATION.md](./GAMIFICATION_INTEGRATION.md#extending-gamification) for details.

## 🚨 Troubleshooting

### Mock data not showing

```javascript
localStorage.setItem('sadeen.mock', '1');
localStorage.removeItem('sadeen.mock.state');
location.reload();
```

### Backend API not responding

1. Check if mock still enabled: `localStorage.getItem('sadeen.mock')`
2. Verify backend running: `npm start` in backend
3. Check API URL: `src/lib/api.ts`

### XP not calculating

Check `GamificationService.calculateGameXp()` parameters:
- gameType must match (quiz, flashcard, etc.)
- isCorrect must be true
- baseXp must be set in game config

## 📚 Documentation Map

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) | Getting started guide | 5 min |
| [GAMIFICATION_INTEGRATION.md](./GAMIFICATION_INTEGRATION.md) | Complete architecture | 15 min |
| [MOCK_DATA_QUICK_REFERENCE.md](./MOCK_DATA_QUICK_REFERENCE.md) | Data lookup reference | 10 min |
| [USING_MOCK_DATA_IN_COMPONENTS.md](./USING_MOCK_DATA_IN_COMPONENTS.md) | Developer guide | 20 min |
| [README_GAMIFICATION.md](./README_GAMIFICATION.md) | This file | 5 min |

## 🎯 Common Tasks

### Run demo immediately
→ [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md#quick-start-5-minutes)

### Understand how XP works
→ [MOCK_DATA_QUICK_REFERENCE.md](./MOCK_DATA_QUICK_REFERENCE.md#xp-rewards-breakdown)

### Add a new game type
→ [GAMIFICATION_INTEGRATION.md](./GAMIFICATION_INTEGRATION.md#add-new-game-type)

### Integrate with real backend
→ [GAMIFICATION_INTEGRATION.md](./GAMIFICATION_INTEGRATION.md#migration-mock--database)

### Use mock data in component
→ [USING_MOCK_DATA_IN_COMPONENTS.md](./USING_MOCK_DATA_IN_COMPONENTS.md#quick-start)

### See data structure
→ [MOCK_DATA_QUICK_REFERENCE.md](./MOCK_DATA_QUICK_REFERENCE.md#mock-state-structure)

## ✅ Checklist

Before starting development:

- [ ] Read SETUP_INSTRUCTIONS.md
- [ ] Run `npm run dev` and test game submission
- [ ] Check localStorage state with DevTools
- [ ] Read GAMIFICATION_INTEGRATION.md
- [ ] Understand progression gates (60% rule)
- [ ] Know how to toggle mock/database mode

Before going to production:

- [ ] Setup real MongoDB instance
- [ ] Configure authentication (JWT)
- [ ] Test database seed with real data
- [ ] Disable mock mode
- [ ] Verify all APIs working
- [ ] Load test with realistic data

## 🔗 Quick Links

**Current System:**
- Frontend runs on `localhost:5173` (Vite)
- Backend runs on `localhost:3000` (Node)
- MongoDB on `localhost:27017` (default)

**Database:**
- Collections: Users, Courses, Lessons, MiniGames, Progress
- Seed script: `backend/src/seed/index.js`
- Config: `backend/src/seed/data/gamification.js`

**Frontend:**
- Mock adapter: `frontend/src/lib/mock-adapter.ts`
- Curriculum: `frontend/src/lib/curriculum.ts`
- Types: `frontend/src/lib/types.ts`

## 💡 Philosophy

This system is built on these principles:

1. **Zero Setup** - Play immediately without backend
2. **Unified Logic** - Same math everywhere (mock & database)
3. **Seamless Switch** - Toggle between mock/real with 1 line
4. **Well Documented** - Extensive guides and examples
5. **Extensible** - Easy to add content and features
6. **Production Ready** - Works at scale when needed

## 🎓 Learning Path

1. **Beginner**: Run demo, play games, understand XP system
2. **Developer**: Read architecture, use mock data in components
3. **Advanced**: Setup database, deploy backend, optimize
4. **Expert**: Add new features, extend gamification, manage analytics

## 📞 Support

All questions answered in documentation:

- **How do I start?** → SETUP_INSTRUCTIONS.md
- **How does it work?** → GAMIFICATION_INTEGRATION.md
- **Where's the data?** → MOCK_DATA_QUICK_REFERENCE.md
- **How do I code?** → USING_MOCK_DATA_IN_COMPONENTS.md

---

## Summary

🎮 **Gamified learning platform**  
📚 **12 lessons × 50+ games**  
✅ **Zero backend setup** (fully functional demo)  
🔄 **Seamless mock ↔ database switch**  
📖 **Complete documentation included**  

**Get started**: `npm run dev` in frontend folder

Enjoy! 🚀

---

Last updated: May 8, 2026
Part of Sadeen Hackathon Project
