# Mock Data Quick Reference

## What's Included

✅ **Courses** (3)
- History (تاريخ الجزائر)
- Math (الرياضيات)
- Coding (البرمجة)

✅ **Lessons** (12 total)
- 4 per course
- 4 difficulty levels (1-4)
- Full content blocks + illustrations
- Hints for each lesson

✅ **Games** (~50 total)
- 6 game types: Quiz, Flashcard, Drag-Drop, Arrow-Match, Image-Puzzle, Tank-Attack
- XP rewards: 5-40 per game
- Heart penalties: 0-2
- Time-Rush quiz multipliers
- Self-grading flashcards

✅ **Users** (6)
- 1 demo student (كريم) - fully playable
- 4 leaderboard students
- Full profiles with XP, hearts, streak, mascot preference

✅ **Gamification**
- XP system (120 XP for demo user)
- Hearts system (5 max, 1-2 penalty per wrong answer)
- Streak tracking (daily consistency bonus)
- Progress gates (60% of level N → unlock level N+1)
- Daily challenges (5 unique, seeded by date)

✅ **Progression**
- 3 lessons completed (demo user)
- 1 in-progress with errors tracked
- Best scores recorded
- Read receipts timestamped

✅ **Analytics** (mock data for dashboards)
- Teacher overview (6 students, activity stats)
- Parent dashboard (2 kids, weekly XP graphs)
- Admin platform overview (DAU, topic split, top students)

---

## File Locations

### Frontend Mock Data

```
frontend/src/lib/
├── mock-data.ts              # MOCK_USER, MOCK_COURSES, MOCK_LESSONS
├── mock-adapter.ts           # Axios interceptor (all game logic here)
└── mock-analytics.ts         # Dashboard stats, deterministic by seed
```

### Backend Seed Data

```
backend/src/seed/
├── index.js                  # Main seed runner
└── data/
    ├── courses.js            # 3 courses
    ├── history.js            # History lessons/games
    ├── math.js               # Math lessons/games
    ├── coding.js             # Coding lessons/games
    ├── gamification.js       # XP, hearts, achievements config
    └── progression.js        # Demo progression states
```

---

## Quick Enable/Disable

### Enable Mock (Frontend Console)

```javascript
localStorage.setItem('sadeen.mock', '1');
localStorage.setItem('sadeen.mock.state', JSON.stringify({
  user: { username: 'كريم', xp: 120, hearts: 5, streak: 3, ... },
  completedLessons: ['l-history-L1-W0', 'l-history-L1-W1'],
  errorsByGame: {},
  readReceipts: {}
}));
location.reload();
```

### Disable Mock (Use Real Backend)

```javascript
localStorage.removeItem('sadeen.mock');
localStorage.removeItem('sadeen.mock.state');
location.reload();
```

### Reset to Defaults

```javascript
localStorage.removeItem('sadeen.mock.state');
location.reload();
```

---

## Game Type Reference

| Type | XP (Easy/Med/Hard) | Hearts | Self-Grade? | Notes |
|------|-------------------|--------|------------|-------|
| Quiz | 10/15/25 | 1 | No | Time-Rush multiplier support |
| Flashcard | 5/8/12 | 0 | Yes | Card flipping, no penalty |
| Drag-Drop | 8/12/20 | 1 | No | Visual ordering |
| Arrow-Match | 8/12/20 | 1 | No | Connection lines |
| Image-Puzzle | 10/15/25 | 1 | No | Tile rearrangement |
| Tank-Attack | 15/25/40 | 2 | No | Hardest, combo multiplier |

---

## Demo Student Progression

### Current State (كريم)

- **Total XP**: 120
- **Hearts**: 5/5
- **Streak**: 3 days
- **Completed Lessons**: 2 (History L1-W0, L1-W1)
- **In Progress**: 1 (History L1-W2, 65% done)
- **Errors Tracked**: 3 total errors in-progress

### How Created

1. Seed script creates User with xp/hearts/streak
2. Progress records inserted:
   - `status: 'completed'` for lessons 0-1
   - `status: 'in_progress'` for lesson 2
   - `errorsByGame: { 'game-1-2-0': 1, 'game-1-2-1': 2 }`
3. Frontend mock-adapter loads from localStorage on next session

---

## Progression Gate Logic

**Rule**: 60% of level N required to unlock level N+1

```javascript
Level 1: Always unlocked
Level 2: Need 60% of Level 1 complete (≥ 2.4 lessons from 4)
Level 3: Need 60% of Level 2 complete (≥ 2.4 lessons from 4)
Level 4: Need 60% of Level 3 complete (≥ 2.4 lessons from 4)
```

**Frontend logic** (mock-adapter.ts line 194-209):
```javascript
const byLevel = { ... };
let prevPassed = true;
for (const lvl of levels) {
  levelGateOpen[lvl] = lvl === 1 ? true : prevPassed;
  const percentage = completed / total;
  prevPassed = percentage >= 0.6;
}
```

---

## XP Rewards Breakdown

**Per Game** (correct answer only)
- Easy: 5-15 XP
- Medium: 8-25 XP
- Hard: 12-40 XP
- Time-Rush multiplier: up to 1.5×

**Per Lesson** (completion bonus)
- Level 1: +50 XP
- Level 2: +75 XP
- Level 3: +100 XP
- Level 4: +150 XP

**Daily Challenges** (claimed once per day)
- Math Minute: 30 XP
- History Flash: 25 XP
- Code Quest: 30 XP
- Combo Master: 35 XP
- Quiz Streak: 40 XP

---

## Leaderboard (Seeded)

| Rank | Username | XP | Streak | Mascot |
|------|----------|----|---------|---------| 
| 1 | أمين | 540 | 9 | Blue |
| 2 | ياسمين | 510 | 7 | Pink |
| 3 | كريم (you) | 120 | 3 | Blue |
| 4 | إيناس | 320 | 4 | Pink |
| 5 | بلال | 290 | 3 | Blue |

---

## Mock State Structure

```javascript
{
  user: {
    _id: string,
    username: string,
    email: string,
    role: 'student',
    xp: number,              // Gamification
    hearts: number,          // Gamification
    streak: number,          // Gamification
    mascotPref: 'blue' | 'pink',
    onboarding: { ... }
  },
  completedLessons: string[],           // Lesson IDs
  errorsByGame: Record<gameId, count>,  // Error tracking
  readReceipts: Record<lessonId, ms>,   // Timestamps
  dailyChallengesClaimed: Record<date, challengeId[]>
}
```

---

## Extending Mock Data

### Add Lesson
1. Edit `frontend/src/lib/curriculum.ts` (LESSON_PACKS)
2. Add to `backend/src/seed/data/history.js` (or math.js/coding.js)
3. Increment lesson count, update level/week indices
4. Reseed: `npm run seed`

### Add Game to Lesson
1. Add game spec to lesson.games array
2. Include: gameType, instructionAr, payload, xpReward, heartPenalty
3. Add correctAnswer logic to mock-adapter.ts checkAnswer()
4. Add game type to GAME_TYPES in MiniGame.js

### Add Daily Challenge
1. Add to dailyChallenges array in gamification.js
2. Seeded deterministically: `all[seed % all.length]`
3. 3 challenges per day (rotating)

### Add User to Leaderboard
1. Add to demoStudents array in seed/index.js
2. Or in mock-analytics.ts buildUsers() function
3. Ensure unique emails and IDs

---

## Testing Checklist

### Mock Mode Tests
- [ ] Can log in (auto-authenticates with MOCK_USER)
- [ ] XP increments on correct game answers
- [ ] Hearts decrement on wrong answers (except flashcard)
- [ ] Streak maintains across sessions (stored in localStorage)
- [ ] Lesson status shows locked/unlocked/in_progress/completed
- [ ] Daily challenges claim XP once per day
- [ ] Leaderboard shows deterministic user list
- [ ] Teacher dashboard shows seeded students
- [ ] Parent dashboard shows seeded kids

### Database Mode Tests
- [ ] MongoDB seed creates all documents
- [ ] API /courses returns 3 courses
- [ ] API /lessons/roadmap/:slug returns 12 lessons
- [ ] API /games/lesson/:id returns games for that lesson
- [ ] Game submission calculates XP correctly
- [ ] Progress records persist and return on GET /progress/me
- [ ] User stats update (xp, hearts, streak)
- [ ] User achievements unlock correctly

---

## Performance Notes

- **Mock mode**: All operations in localStorage (instant)
- **Database mode**: Network latency (~50-200ms per request)
- **Lesson content**: Cached after first load
- **Games**: Preloaded with lesson content
- **Leaderboard**: Sorted deterministically (no real-time updates in mock)

---

## Customization Points

1. **Difficulty levels**: 1-4 (configurable in lesson pack)
2. **XP rewards**: Per-game and per-difficulty in GAMIFICATION_CONFIG
3. **Heart system**: Max 5, penalties 0-2 per game type
4. **Streak logic**: Daily minimum activity, resets on miss
5. **Progression gates**: 60% threshold (configurable)
6. **Daily challenges**: 5 unique, 3 per day rotation
7. **Achievements**: 6 defined, easily extensible

---

## Known Limitations (Mock Mode)

- No real-time multiplayer (leaderboard static)
- No attendance tracking (assumes daily activity)
- No teacher grading (students self-grade flashcards)
- No analytics aggregation (mock data deterministic)
- No parent notifications (manually checked)
- No offline sync (must stay in localStorage)

---

## Migration to Real Database

When you're ready to use the backend:

```bash
# 1. Start MongoDB
mongod --dbpath ./data

# 2. Seed database
cd backend && npm run seed

# 3. Start backend API
npm start

# 4. In frontend, disable mock
localStorage.removeItem('sadeen.mock');

# 5. Update API_BASE_URL to backend
// src/lib/api.ts: baseURL: 'http://localhost:3000/api'

# 6. Reload and test
```

All game logic is identical between mock and database modes. No code changes needed besides enabling the backend.

---

Last updated: May 8, 2026
