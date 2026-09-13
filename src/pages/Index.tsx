import { lazy, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustBadges } from '@/components/landing/TrustBadges';

// Below-fold sections lazy-loaded so the hero renders immediately without waiting
// for framer-motion useInView/useSpring hooks in these components to be parsed.
const StatsSection = lazy(() => import('@/components/landing/StatsSection').then(m => ({ default: m.StatsSection })));
const FeaturesSection = lazy(() => import('@/components/landing/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const HowItWorksSection = lazy(() => import('@/components/landing/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));
const WealthSection = lazy(() => import('@/components/landing/WealthSection').then(m => ({ default: m.WealthSection })));
const IntegrationsSection = lazy(() => import('@/components/landing/IntegrationsSection').then(m => ({ default: m.IntegrationsSection })));
const TestimonialsSection = lazy(() => import('@/components/landing/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const CTASection = lazy(() => import('@/components/landing/CTASection').then(m => ({ default: m.CTASection })));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBadges />
        <Suspense fallback={null}>
          <StatsSection />
          <FeaturesSection />
          <HowItWorksSection />
          <WealthSection />
          <IntegrationsSection />
          <TestimonialsSection />
          <CTASection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
