import {
  Home,
  Layers,
  Trophy,
  User,
  Users,
  GraduationCap,
  PieChart,
  BookOpen,
  CreditCard,
  MessageSquare,
  BarChart3
} from 'lucide-react';

export interface NavItem {
  to: string;
  icon: any;
  labelAr: string;
  end?: boolean;
  badge?: 'soon';
}

export const STUDENT_NAV: NavItem[] = [
  { to: '/app', icon: Home, labelAr: 'لوحة الانطلاق', end: true },
  { to: '/app/courses/history', icon: Layers, labelAr: 'المواد' },
  { to: '/app/leaderboard', icon: Trophy, labelAr: 'لوحة المتميّزين' },
  { to: '/app/profile', icon: User, labelAr: 'الملف الشخصي' }
];

export const TEACHER_NAV: NavItem[] = [
  { to: '/teacher', icon: Home, labelAr: 'لوحة الأستاذ', end: true },
  { to: '/teacher/students', icon: Users, labelAr: 'تلاميذي' },
  { to: '/teacher/courses', icon: BookOpen, labelAr: 'الدّروس' },
  { to: '/teacher/messages', icon: MessageSquare, labelAr: 'الرسائل', badge: 'soon' },
  { to: '/teacher/profile', icon: User, labelAr: 'الملف الشخصي' }
];

export const PARENT_NAV: NavItem[] = [
  { to: '/parent', icon: Home, labelAr: 'لوحة وليّ الأمر', end: true },
  { to: '/parent/kids', icon: GraduationCap, labelAr: 'أبنائي' },
  { to: '/parent/billing', icon: CreditCard, labelAr: 'الاشتراك' },
  { to: '/parent/messages', icon: MessageSquare, labelAr: 'الرسائل', badge: 'soon' },
  { to: '/parent/profile', icon: User, labelAr: 'الملف الشخصي' }
];

export const ADMIN_NAV: NavItem[] = [
  { to: '/admin', icon: Home, labelAr: 'نظرة عامّة', end: true },
  { to: '/admin/users', icon: Users, labelAr: 'المستخدمون' },
  { to: '/admin/analytics', icon: BarChart3, labelAr: 'التحليلات' },
  { to: '/admin/messages', icon: MessageSquare, labelAr: 'الرسائل', badge: 'soon' }
];

export function navForRole(role?: string): NavItem[] {
  if (role === 'admin') return ADMIN_NAV;
  if (role === 'teacher') return TEACHER_NAV;
  if (role === 'parent') return PARENT_NAV;
  return STUDENT_NAV;
}

export function homePathForRole(role?: string): string {
  if (role === 'admin') return '/admin';
  if (role === 'teacher') return '/teacher';
  if (role === 'parent') return '/parent';
  return '/app';
}
