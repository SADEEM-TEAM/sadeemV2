import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/store/auth.store';
import { homePathForRole } from '../layouts/navConfig';
import type { Role } from '@/lib/types';

export function RoleGuard({ roles }: { roles: Role[] }) {
  const user = useAuth((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }
  return <Outlet />;
}
