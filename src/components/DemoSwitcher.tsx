import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Smartphone, LayoutDashboard, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DemoSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setUserRole } = useApp();
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Lock body scroll when modal is active
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const handleSelectCustomer = () => {
    try {
      localStorage.setItem('gc_user_role', 'customer');
      if (setUserRole) {
        setUserRole('customer');
      }
    } catch (err) {
      console.error('Failed to set customer role', err);
    }
    setIsOpen(false);
    navigate('/menu');
  };

  const handleSelectStaff = () => {
    try {
      localStorage.setItem('gc_user_role', 'cashier');
      if (setUserRole) {
        setUserRole('cashier');
      }
    } catch (err) {
      console.error('Failed to set cashier role', err);
    }
    setIsOpen(false);
    navigate('/admin');
  };

  return (
    <>
       {/* Floating Demo Switcher Trigger Button */}
       <div ref={constraintsRef} className="fixed bottom-6 right-6 z-[9999]">
         <motion.button
           type="button"
           onClick={() => setIsOpen(true)}
           drag
           dragConstraints={constraintsRef}
           dragElastic={0.1}
           dragMomentum={true}
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           aria-label="Open Demo Mode Switcher"
           className="flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl glass-light dark:glass-dark bg-white/90 dark:bg-brand-dark-card/90 border border-brand-emerald/20 dark:border-white/10 hover:border-brand-primary/40 dark:hover:border-brand-amber/40 text-brand-text dark:text-white transition-all cursor-pointer group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary dark:bg-brand-amber opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary dark:bg-brand-amber"></span>
        </span>
        <Sparkles className="w-4 h-4 text-brand-primary dark:text-brand-amber group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-brand-primary via-brand-primary-dark to-brand-accent dark:from-brand-amber dark:to-brand-gold bg-clip-text text-transparent">
          Demo Switcher
        </span>
       </motion.button>
       </div>

       {/* Modal Overlay & Card */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Modal Dialog Content */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="demo-switcher-title"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl glass-light dark:glass-dark bg-white/95 dark:bg-brand-dark-card/95 border border-white/40 dark:border-brand-dark-border shadow-2xl rounded-3xl p-6 sm:p-8 z-10 overflow-hidden"
            >
              {/* Background Glow Accents */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-primary/10 dark:bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-brand-accent/20 dark:bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6 sm:mb-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 dark:bg-brand-amber/10 border border-brand-primary/20 dark:border-brand-amber/30 text-brand-primary dark:text-brand-amber text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  GENZCHIYA Demo Experience
                </div>
                <h2 id="demo-switcher-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Choose Demo Mode
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Switch seamlessly between customer ordering and staff operational dashboards.
                </p>
              </div>

              {/* Option Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* Customer Mode Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-brand-dark-bg/60 border border-slate-200/80 dark:border-brand-dark-border/80 hover:border-brand-primary/50 dark:hover:border-brand-amber/50 shadow-md hover:shadow-xl transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-rose-50 dark:bg-brand-primary/10 text-brand-primary dark:text-brand-primary-light group-hover:scale-110 transition-transform">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <span className="text-xl" role="img" aria-label="Customer phone">📱</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      Customer Mode
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      Scan QR Code, browse the menu, customize your order, add items to the cart, place an order, and track your order.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectCustomer}
                    className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <span>Enter Customer Mode</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

                {/* Staff / Cashier & Kitchen Mode Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-brand-dark-bg/60 border border-slate-200/80 dark:border-brand-dark-border/80 hover:border-brand-amber/50 dark:hover:border-brand-amber/50 shadow-md hover:shadow-xl transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-brand-amber/10 text-amber-600 dark:text-brand-amber group-hover:scale-110 transition-transform">
                        <LayoutDashboard className="w-7 h-7" />
                      </div>
                      <span className="text-xl" role="img" aria-label="Cashier and kitchen">☕👨‍🍳</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      Cashier &amp; Kitchen Mode
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      Manage customer orders, generate tokens, process payments, and monitor kitchen status in real time.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectStaff}
                    className="w-full bg-slate-900 dark:bg-brand-amber hover:bg-slate-800 dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <span>Enter Staff Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  </motion.div>
              </div>

              {/* Bottom Note */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-brand-dark-border/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald dark:text-brand-amber" />
                  Quick role simulation mode enabled
                </span>
                <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-[10px] font-mono border border-slate-300 dark:border-white/10">Esc</kbd> to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DemoSwitcher;
