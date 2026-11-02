import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { LandingNav } from './landing/LandingNav';
import { HeroSection } from './landing/HeroSection';
import { AudienciasSection } from './landing/AudienciasSection';
import { IncluyeSection } from './landing/IncluyeSection';
import { ComoFuncionaSection } from './landing/ComoFuncionaSection';
import { BeneficiosSection } from './landing/BeneficiosSection';
import { LandingFooter } from './landing/LandingFooter';

export function LandingPage() {
  const authenticated = useAuthStore((s) => !!s.accessToken);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      <LandingNav authenticated={authenticated} />
      <HeroSection authenticated={authenticated} />
      <AudienciasSection />
      <IncluyeSection />
      <ComoFuncionaSection />
      <BeneficiosSection />
      <LandingFooter authenticated={authenticated} />
    </div>
  );
}

export function LandingOrRedirect() {
  const authenticated = useAuthStore((s) => !!s.accessToken);
  if (authenticated) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}
