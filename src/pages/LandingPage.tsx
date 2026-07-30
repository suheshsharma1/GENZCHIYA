import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturedSpecials } from '../components/landing/FeaturedSpecials';
import { HowItWorks } from '../components/landing/HowItWorks';
import { TableGridSection } from '../components/landing/TableGridSection';
import { AboutSection } from '../components/landing/AboutSection';
import { Testimonials } from '../components/landing/Testimonials';
import { ContactSection } from '../components/landing/ContactSection';
import { Footer } from '../components/landing/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-brand-bg overflow-x-hidden selection:bg-brand-primary selection:text-white">
      <Navbar />

      <main>
        <HeroSection />
        <FeaturedSpecials />
        <HowItWorks />
        <TableGridSection />
        <AboutSection />
        <Testimonials />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;