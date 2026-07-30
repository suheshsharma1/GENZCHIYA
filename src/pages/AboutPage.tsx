import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SVGLogo } from '../components/SVGLogo';
import { AboutSection } from '../components/landing/AboutSection';
import { ContactSection } from '../components/landing/ContactSection';
import { Footer } from '../components/landing/Footer';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-brand-sage dark:text-brand-mint hover:text-brand-amber transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Back</span>
        </button>
        <SVGLogo size={36} />
        <div className="w-16" />
      </header>

      <main className="flex-1">
        {/* About Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;