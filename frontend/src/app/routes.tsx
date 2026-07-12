import { createBrowserRouter } from 'react-router';

import { HydrationGate, RequireAuth, PublicShell, BareShell } from './guards/Guards';
import { AppLayout } from './layouts/AppLayout';
import { STUDENT_NAV, TEACHER_NAV, PARENT_NAV, ADMIN_NAV } from './layouts/navConfig';
import { RoleGuard } from './guards/RoleGuard';

import { LandingScreen } from './screens/public/LandingScreen';
import { RoleSelectScreen } from './screens/public/RoleSelectScreen';
import { LoginScreen } from './screens/public/LoginScreen';
import { RegisterScreen } from './screens/public/RegisterScreen';
import { OnboardingScreen } from './screens/public/OnboardingScreen';

import { DashboardScreen } from './screens/student/DashboardScreen';
import { RoadmapScreen } from './screens/student/RoadmapScreen';
import { LessonScreen } from './screens/student/LessonScreen';
import { GameHostScreen } from './screens/student/GameHostScreen';
import { DevGameScreen } from './screens/student/DevGameScreen';
import { CelebrationScreen } from './screens/student/CelebrationScreen';
import { LeaderboardScreen } from './screens/student/LeaderboardScreen';

import { TeacherOverviewScreen } from './screens/teacher/TeacherOverviewScreen';
import { TeacherStudentsScreen } from './screens/teacher/TeacherStudentsScreen';
import { TeacherCoursesScreen } from './screens/teacher/TeacherCoursesScreen';

import { ParentOverviewScreen } from './screens/parent/ParentOverviewScreen';
import { ParentKidScreen } from './screens/parent/ParentKidScreen';
import { ParentBillingScreen } from './screens/parent/ParentBillingScreen';

import { AdminOverviewScreen } from './screens/admin/AdminOverviewScreen';
import { AdminUsersScreen } from './screens/admin/AdminUsersScreen';

import { MessagesScreen } from './screens/shared/MessagesScreen';
import { ProfileScreen } from './screens/shared/ProfileScreen';

export const router = createBrowserRouter([
  {
    element: (
      <HydrationGate>
        <BareShell />
      </HydrationGate>
    ),
    children: [{ path: '/', Component: LandingScreen }]
  },
  {
    element: (
      <HydrationGate>
        <PublicShell />
      </HydrationGate>
    ),
    children: [
      { path: '/role', Component: RoleSelectScreen },
      { path: '/login', Component: LoginScreen },
      { path: '/register', Component: RegisterScreen }
    ]
  },
  {
    element: (
      <HydrationGate>
        <RequireAuth />
      </HydrationGate>
    ),
    children: [
      {
        element: <PublicShell />,
        children: [{ path: '/onboarding', Component: OnboardingScreen }]
      },
      // Student
      {
        element: <RoleGuard roles={['student']} />,
        children: [
          {
            path: '/app',
            element: <AppLayout nav={STUDENT_NAV} showStudentStats />,
            children: [
              { index: true, Component: DashboardScreen },
              { path: 'courses/:slug', Component: RoadmapScreen },
              { path: 'lessons/:id', Component: LessonScreen },
              { path: 'lessons/:id/play', Component: GameHostScreen },
              { path: 'dev/game/:type', Component: DevGameScreen },
              { path: 'celebrate', Component: CelebrationScreen },
              { path: 'leaderboard', Component: LeaderboardScreen },
              { path: 'messages', Component: MessagesScreen },
              { path: 'profile', Component: ProfileScreen }
            ]
          }
        ]
      },
      // Teacher
      {
        element: <RoleGuard roles={['teacher']} />,
        children: [
          {
            path: '/teacher',
            element: <AppLayout nav={TEACHER_NAV} />,
            children: [
              { index: true, Component: TeacherOverviewScreen },
              { path: 'students', Component: TeacherStudentsScreen },
              { path: 'courses', Component: TeacherCoursesScreen },
              { path: 'messages', Component: MessagesScreen },
              { path: 'profile', Component: ProfileScreen }
            ]
          }
        ]
      },
      // Parent
      {
        element: <RoleGuard roles={['parent']} />,
        children: [
          {
            path: '/parent',
            element: <AppLayout nav={PARENT_NAV} />,
            children: [
              { index: true, Component: ParentOverviewScreen },
              { path: 'kids', Component: ParentOverviewScreen },
              { path: 'kids/:id', Component: ParentKidScreen },
              { path: 'billing', Component: ParentBillingScreen },
              { path: 'messages', Component: MessagesScreen },
              { path: 'profile', Component: ProfileScreen }
            ]
          }
        ]
      },
      // Admin
      {
        element: <RoleGuard roles={['admin']} />,
        children: [
          {
            path: '/admin',
            element: <AppLayout nav={ADMIN_NAV} />,
            children: [
              { index: true, Component: AdminOverviewScreen },
              { path: 'users', Component: AdminUsersScreen },
              { path: 'analytics', Component: AdminOverviewScreen },
              { path: 'messages', Component: MessagesScreen }
            ]
          }
        ]
      }
    ]
  },
  { path: '*', Component: LandingScreen }
]);
