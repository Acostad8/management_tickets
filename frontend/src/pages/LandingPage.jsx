import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { LandingNav } from './landing/LandingNav';
import { HeroSection } from './landing/HeroSection';
import { ModulosSection } from './landing/ModulosSection';
import { PolimorfismoSection } from './landing/PolimorfismoSection';
import { AnalyticsSection } from './landing/AnalyticsSection';
import { LandingFooter } from './landing/LandingFooter';

export function LandingPage() {
  const authenticated = useAuthStore((s) => !!s.accessToken);

  useEffect(() => {
    document.body.classList.add('landing');
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    root.classList.add('dark');
    return () => {
      document.body.classList.remove('landing');
      if (!hadDark) root.classList.remove('dark');
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      <LandingNav authenticated={authenticated} />
      <HeroSection authenticated={authenticated} />
      <ModulosSection />
      <PolimorfismoSection />
      <AnalyticsSection />
      <LandingFooter authenticated={authenticated} />
    </div>
  );
}

export function LandingOrRedirect() {
  const authenticated = useAuthStore((s) => !!s.accessToken);
  if (authenticated) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}
