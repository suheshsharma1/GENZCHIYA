import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-brand-bg dark:bg-brand-dark-bg text-brand-text dark:text-slate-100 transition-colors duration-300 overflow-x-hidden selection:bg-brand-primary selection:text-white">
      <Navbar />

      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default LandingPage;