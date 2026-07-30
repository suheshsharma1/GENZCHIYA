import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Clock } from 'lucide-react';

const DISMISS_KEY = 'gc_promo_banner_dismissed';

const getDismissedDate = (): string | null => {
  try {
    return localStorage.getItem(DISMISS_KEY);
  } catch {
    return null;
  }
};

const setDismissedDate = (): void => {
  try {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString().split('T')[0]);
  } catch {
    /* ignore */
  }
};

const isDismissedToday = (): boolean => {
  const dismissed = getDismissedDate();
  if (!dismissed) return false;
  const today = new Date().toISOString().split('T')[0];
  return dismissed === today;
};

const PromoBanner: React.FC = () => {
  const [visible, setVisible] = useState(!isDismissedToday());
  const [dismissed, setDismissed] = useState(isDismissedToday());

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    setDismissedDate();
  }, []);

  const handleOrderNow = useCallback(() => {
    window.location.href = '/menu?category=tea';
  }, []);

  useEffect(() => {
    if (visible && !dismissed) {
      const timer = setTimeout(() => {
        if (isDismissedToday()) {
          setVisible(false);
        }
      }, 300000);
      return () => clearTimeout(timer);
    }
  }, [visible, dismissed]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed top-0 left-0 right-0 z-[9998] h-[44px] bg-gradient-to-r from-brand-emerald via-emerald-600 to-brand-amber flex items-center px-4 shadow-lg"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Gift className="text-yellow-300 shrink-0" size={16} />
          <span className="text-[11px] font-bold text-white truncate">
            🎉 <span className="hidden sm:inline">Buy 5 Cups of Tea, Pay for Only 4 — Get 1 Cup FREE!</span>
            <span className="sm:hidden">Buy 5 Tea Cups, Pay for 4 — 1 Free!</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOrderNow}
            className="bg-white text-brand-emerald hover:bg-yellow-50 font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow transition-all duration-200 cursor-pointer"
          >
            Order Now
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white p-1 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;