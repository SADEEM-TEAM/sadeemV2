# Using Mock Data in Components

## Quick Start

All mock data is automatically served by the frontend mock adapter. No code changes needed when switching between mock and database modes.

### Component Example: Game Submit

```typescript
// src/app/games/GameComponent.tsx
import { useCallback } from 'react';
import { submitGameAnswer } from '@/lib/api';

export function GameComponent({ game }) {
  const handleSubmit = useCallback(async (answer) => {
    try {
      // This works the SAME whether using mock or database
      const response = await submitGameAnswer(game._id, answer);
      
      // response structure is identical:
      // {
      //   correct: boolean,
      //   xpEarned: number,
      //   heartsLost: number,
      //   hearts: number,
      //   maxHearts: 5,
      //   xp: number,
      //   errors: number
      // }
      
      updateUI(response);
    } catch (error) {
      handleError(error);
    }
  }, [game._id]);
  
  return <GameUI onSubmit={handleSubmit} />;
}
```

### Check If Using Mock

```typescript
import { isMockMode } from '@/lib/mock-adapter';

if (isMockMode()) {
  console.log('Running in mock mode (localStorage)');
} else {
  console.log('Connected to real backend');
}
```

### Reset Mock State (DevTools)

```javascript
// Browser console
import { resetMockState, enableMockMode } from '@/lib/mock-adapter';

// Reset to initial state
resetMockState();

// Disable mock and use backend
enableMockMode(false);

// Re-enable mock
enableMockMode(true);
```

---

## Accessing Mock Data Directly

### Get User Profile

```typescript
import { MOCK_USER } from '@/lib/mock-data';

console.log(MOCK_USER.username);  // 'كريم'
console.log(MOCK_USER.xp);        // 120
console.log(MOCK_USER.hearts);    // 5
console.log(MOCK_USER.streak);    // 3
```

### Get All Courses

```typescript
import { MOCK_COURSES } from '@/lib/mock-data';

MOCK_COURSES.forEach(course => {
  console.log(course.titleAr);
  console.log(course.slug);       // 'history', 'math', 'coding'
  console.log(course.accent);     // color config
});
```

### Get Lessons for a Course

```typescript
import { lessonsForCourseSlug } from '@/lib/mock-data';

const historyLessons = lessonsForCourseSlug('history');
historyLessons.forEach(lesson => {
  console.log(lesson._id);
  console.log(lesson.titleAr);
  console.log(lesson.level);      // 1-4
  console.log(lesson.xpReward);   // 50, 75, 100, 150
});
```

### Get a Specific Lesson

```typescript
import { findLesson } from '@/lib/mock-data';

const lesson = findLesson('l-history-L1-W0');
console.log(lesson.lesson);        // Full lesson object
console.log(lesson.games);         // Array of MiniGameDoc
console.log(lesson.correctAnswers); // Answer keys for non-self-grading games
```

### Get Mascot Response

```typescript
import { mascotReply } from '@/lib/mock-data';

// Contextual mascot messages
const reply = mascotReply('lesson_start', 0);
console.log(reply.messageAr);     // 'ركّز معي، الدرس قصير وممتع.'
console.log(reply.expression);    // 'thinking'

// After 3+ errors
const reply2 = mascotReply('errors_three', 3, 'l-history-L1-W0');
console.log(reply2.hintAr);       // Hint from lesson
```

---

## API Integration Pattern

### Current Implementation (mock-adapter.ts)

```typescript
// Line 68-526 in mock-adapter.ts contain all matchers
const matchers = [
  {
    re: /^\/?auth\/(login|register)$/,
    method: 'post',
    handle: () => { /* authenticate */ }
  },
  {
    re: /^\/?courses$/,
    method: 'get',
    handle: () => { /* return MOCK_COURSES */ }
  },
  {
    re: /^\/?lessons\/roadmap\/([^/]+)$/,
    method: 'get',
    handle: (m) => { /* return lessonsForCourseSlug(m[1]) */ }
  },
  // ... 20+ more routes ...
];
```

### How Routes Work

```typescript
// 1. Request comes in
POST /api/games/g-history-L1-W0-0/submit
{ answer: [...] }

// 2. Mock adapter intercepts (if enabled)
const url = '/games/g-history-L1-W0-0/submit';
const matcher = matchers.find(m => m.re.test(url));

// 3. Handler executes
matcher.handle(match, config, body);

// 4. Response returns
{ correct: true, xpEarned: 10, heartsLost: 0, ... }
```

---

## Testing with Mock Data

### Unit Test Example

```typescript
// __tests__/gamification.test.ts
import { checkAnswer } from '@/lib/mock-adapter';
import { findLesson } from '@/lib/mock-data';

describe('Game Answer Validation', () => {
  it('validates quiz answers', () => {
    const lesson = findLesson('l-history-L1-W0');
    const game = lesson.games[0];
    const expected = lesson.correctAnswers[game._id];
    
    // Test correct answer
    const isCorrect = checkAnswer(game.gameType, game.payload, expected, {
      correct: true
    });
    expect(isCorrect).toBe(true);
    
    // Test wrong answer
    const isWrong = checkAnswer(game.gameType, game.payload, expected, {
      correct: false
    });
    expect(isWrong).toBe(false);
  });
});
```

### E2E Test Example (with Cypress)

```typescript
// cypress/e2e/game.cy.ts
import { resetMockState, enableMockMode } from '@/lib/mock-adapter';

describe('Game Flow (Mock Mode)', () => {
  before(() => {
    enableMockMode(true);
    resetMockState();
  });

  it('submits game and updates XP', () => {
    cy.visit('/courses/history');
    cy.contains('الجزائر قبل 8 ماي 1945').click();
    
    // Take game
    cy.get('[data-test="game-container"]').should('be.visible');
    cy.get('[data-test="submit-answer"]').click();
    
    // Check XP popup
    cy.contains('أحسنت').should('be.visible');
    cy.contains('+10').should('be.visible');
    
    // Check user stats updated
    cy.get('[data-test="user-xp"]').contains('130'); // 120 + 10
  });
});
```

---

## State Management Integration

### Using with Zustand (or any store)

```typescript
// src/store/game.store.ts
import { create } from 'zustand';
import { submitGameAnswer } from '@/lib/api';

interface GameState {
  xp: number;
  hearts: number;
  streak: number;
  submitGame: (gameId: string, answer: any) => Promise<void>;
}

export const useGameStore = create<GameState>((set) => ({
  xp: 120,
  hearts: 5,
  streak: 3,
  
  submitGame: async (gameId, answer) => {
    const result = await submitGameAnswer(gameId, answer);
    
    set((state) => ({
      xp: result.xp,
      hearts: result.hearts,
      streak: result.streak  // if included in response
    }));
  }
}));
```

### Using with React Query

```typescript
// src/hooks/useGameSubmit.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { submitGameAnswer, getGameLesson } from '@/lib/api';

export function useGameSubmit(gameId: string) {
  return useMutation({
    mutationFn: (answer) => submitGameAnswer(gameId, answer),
    onSuccess: (data) => {
      // Update user XP, hearts, etc.
      console.log('XP earned:', data.xpEarned);
    },
    onError: (error) => {
      console.error('Game submit failed:', error);
    }
  });
}

export function useGameLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getGameLesson(lessonId),
    staleTime: 1000 * 60 * 5 // Cache 5 minutes
  });
}
```

---

## Debug Mode

### Enable Verbose Logging

Add to `src/lib/mock-adapter.ts`:

```typescript
const DEBUG = localStorage.getItem('sadeen.debug') === '1';

// In handle function:
if (DEBUG) {
  console.log('Mock:', {
    method: m.method,
    url: cleaned,
    body,
    response: data
  });
}
```

Enable in console:
```javascript
localStorage.setItem('sadeen.debug', '1');
location.reload();
```

### Inspect Mock State

```javascript
// Browser console
const state = JSON.parse(localStorage.getItem('sadeen.mock.state'));
console.log('User XP:', state.user.xp);
console.log('Completed lessons:', state.completedLessons);
console.log('Errors:', state.errorsByGame);
```

### Network Simulation

```javascript
// Simulate slow network in mock
// src/lib/mock-adapter.ts line 596
setTimeout(() => {
  return ok(config, data);
}, 500); // 500ms delay
```

---

## Component Examples

### Dashboard Displaying Mock User

```typescript
// src/app/dashboard/Dashboard.tsx
import { useEffect, useState } from 'react';
import { getMeUser } from '@/lib/api';
import type { AuthUser } from '@/lib/types';

export function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMeUser().then(setUser);
  }, []);

  if (!user) return <Loading />;

  return (
    <div>
      <h1>{user.username}</h1>
      
      <div>XP: {user.xp}</div>
      <div>Hearts: {user.hearts}/5</div>
      <div>Streak: {user.streak}</div>
      <div>Mascot: {user.mascotPref}</div>
      
      {/* Works the same whether mock or real backend */}
    </div>
  );
}
```

### Course List with Progress

```typescript
// src/app/courses/CourseList.tsx
import { getCourses } from '@/lib/api';
import type { Course } from '@/lib/types';

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  return (
    <div>
      {courses.map(course => (
        <CourseCard
          key={course._id}
          course={course}
          progress={course.progress?.completed / course.progress?.total}
        />
      ))}
    </div>
  );
}
```

### Lesson Roadmap with Gates

```typescript
// src/app/courses/LessonRoadmap.tsx
import { useParams } from 'react-router-dom';
import { getLessonRoadmap } from '@/lib/api';
import type { RoadmapLesson } from '@/lib/types';

export function LessonRoadmap() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [lessons, setLessons] = useState<RoadmapLesson[]>([]);

  useEffect(() => {
    getLessonRoadmap(courseSlug!).then(data => {
      setLessons(data.lessons);
    });
  }, [courseSlug]);

  return (
    <div>
      {lessons.map((lesson, idx) => (
        <LessonCard
          key={lesson._id}
          lesson={lesson}
          status={lesson.status} // 'locked' | 'unlocked' | 'in_progress' | 'completed'
          index={idx}
        />
      ))}
    </div>
  );
}
```

---

## Gamification Features

### Display XP Earned

```typescript
// After game submission
const { xpEarned, gameType } = response;

// Show popup
showXpPopup({
  amount: xpEarned,
  icon: gameType,
  duration: 2000
});

// Update UI
updateUserXp(user.xp + xpEarned);
```

### Handle Heart Loss

```typescript
const { heartsLost, hearts } = response;

if (heartsLost > 0) {
  showHeartAnimation(heartsLost);
  
  if (hearts === 0) {
    showOutOfHeartsDialog();
    // Suggest waiting for recovery or purchasing more
  }
}
```

### Streak Display

```typescript
<div className="streak">
  🔥 {user.streak} {user.streak > 1 ? 'أيام' : 'يوم'}
</div>
```

### Achievement Notifications

```typescript
const { achievements } = response; // if included

if (achievements.length > 0) {
  achievements.forEach(ach => {
    showAchievementNotification({
      title: ach.titleAr,
      description: ach.descAr,
      icon: ach.icon
    });
  });
}
```

---

## Migration Checklist

### Before Switching to Backend

- [ ] All components use `/lib/api` functions (not hardcoded URLs)
- [ ] No direct localStorage access (use store instead)
- [ ] All game logic uses shared GamificationService
- [ ] Test data covers all game types
- [ ] Backend seed script runs successfully
- [ ] Database connection configured
- [ ] CORS settings allow frontend requests

### Switching Steps

1. Ensure backend running:
   ```bash
   cd backend && npm start
   ```

2. Disable mock in frontend:
   ```javascript
   localStorage.removeItem('sadeen.mock');
   ```

3. Update API base URL:
   ```typescript
   // src/lib/api.ts
   const API = axios.create({
     baseURL: 'http://localhost:3000/api'
   });
   ```

4. Reload and test
   
5. Clear old mock state if needed:
   ```javascript
   localStorage.removeItem('sadeen.mock.state');
   ```

---

## Performance Tips

### Lazy Load Lessons

```typescript
const [lessonCache, setLessonCache] = useState({});

const loadLesson = useCallback(async (id: string) => {
  if (lessonCache[id]) return lessonCache[id];
  
  const lesson = await getLesson(id);
  setLessonCache(prev => ({ ...prev, [id]: lesson }));
  return lesson;
}, [lessonCache]);
```

### Cache Game Games

```typescript
const [gamesCache, setGamesCache] = useState({});

const loadGames = useCallback(async (lessonId: string) => {
  if (gamesCache[lessonId]) return gamesCache[lessonId];
  
  const games = await getGamesByLesson(lessonId);
  setGamesCache(prev => ({ ...prev, [lessonId]: games }));
  return games;
}, [gamesCache]);
```

### Preload Next Lesson

```typescript
// While user is in current lesson
useEffect(() => {
  if (currentLessonIndex < allLessons.length - 1) {
    const nextId = allLessons[currentLessonIndex + 1]._id;
    getLesson(nextId); // Preload for next navigation
  }
}, [currentLessonIndex, allLessons]);
```

---

## Summary

- **All data flows through `/lib/api`** - works with mock or backend
- **Mock adapter intercepts requests** - no code changes needed to switch
- **Direct access available** - import MOCK_* for offline components
- **Gamification is unified** - same logic in mock-adapter and backend
- **State management agnostic** - works with any store (Zustand, Redux, etc.)
- **Fully testable** - control mock mode in unit and E2E tests

The key principle: **Write components as if connected to real backend. The mock adapter handles switching seamlessly.**
