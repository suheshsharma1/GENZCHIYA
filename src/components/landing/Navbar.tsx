import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { SVGLogo } from '../SVGLogo';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`mt-3 rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg ${
          isDarkMode
            ? 'glass-dark shadow-black/20 border-white/5'
            : 'bg-white/80 shadow-black/5 border-white/30'
        }`}>
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <SVGLogo variant="icon" size={32} />
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-black text-brand-primary tracking-wider group-hover:text-brand-primary-dark transition-colors">
                GENZCHIYA
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Smart Tea Café
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-primary font-black'
                      : 'text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-brand-primary/25 transition-all cursor-pointer"
            >
              Staff Portal
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 rounded-2xl p-4 md:hidden shadow-lg ${
              isDarkMode
                ? 'glass-dark shadow-black/20 border-white/5'
                : 'bg-white/80 shadow-black/5 border-white/30'
            }`}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    setIsOpen(false);
                    handleNavClick(link.href);
                  }}
                  className={`block w-full text-left py-2.5 text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-brand-primary font-black'
                      : 'text-gray-600 dark:text-gray-300 hover:text-brand-primary'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="border-t border-gray-200 dark:border-brand-dark-border mt-3 pt-3 flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="text-sm font-bold text-gray-600 dark:text-gray-300"
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={() => { navigate('/login'); setIsOpen(false); }}
                className="bg-brand-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Staff Portal
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;