import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { GallerySection } from '../components/landing/GallerySection';
import { Footer } from '../components/landing/Footer';

export const GalleryPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 max-w-7xl mx-auto px-4 w-full">
        <GallerySection />
      </main>

      <Footer />
    </div>
  );
};

export default GalleryPage;
