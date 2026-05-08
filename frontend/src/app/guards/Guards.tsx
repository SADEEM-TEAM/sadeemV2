import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/store/auth.store';
import { LandingBackdrop } from '../components/landing/LandingBackdrop';

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const hydrate = useAuth((s) => s.hydrate);

  useEffect(() => {
    hydrate().finally(() => setReady(true));
  }, [hydrate]);

  if (!ready) {
    return (
      <div
        className="fixed inset-0 grid place-items-center text-white/70"
        style={{ fontFamily: 'Cairo' }}
      >
        جارٍ التحميل…
      </div>
    );
  }
  return <>{children}</>;
}

export function RequireAuth() {
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.token);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!user) return null;
  if (!user.onboarding?.completed && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}

export function PublicShell() {
  return (
    <>
      <LandingBackdrop />
      <div className="relative z-10">
        <Outlet />
      </div>
    </>
  );
}

export function BareShell() {
  // Landing renders its own backdrop; don't double-render.
  return <Outlet />;
}
