import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



export const SaturdayOfferBanner: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });
  const [isSaturday, setIsSaturday] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Check Saturday status & calculate countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const day = now.getDay();
      setIsSaturday(day === 6);

      if (day === 6) {
        const endOfSaturday = new Date(now);
        endOfSaturday.setHours(20, 0, 0, 0);
        if (now > endOfSaturday) {
          endOfSaturday.setHours(23, 59, 59, 999);
        }
        const diffMs = Math.max(0, endOfSaturday.getTime() - now.getTime());
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        const nextSaturday = new Date(now);
        const daysUntilSaturday = (6 - day + 7) % 7 || 7;
        nextSaturday.setDate(now.getDate() + daysUntilSaturday);
        nextSaturday.setHours(8, 0, 0, 0);
        const diffMs = Math.max(0, nextSaturday.getTime() - now.getTime());
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full max-w-7xl mx-auto mb-6"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_40px_-10px_rgba(180,20,40,0.35)] border border-white/20"
      >
        {/* Compact Crimson & Velvet Background */}
        <div className="relative bg-gradient-to-r from-[#7A0617] via-[#B8162F] to-[#590410] overflow-hidden p-4 sm:p-6 lg:py-5 lg:px-8">

          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-amber-400/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-rose-500/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 opacity-30 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

            {/* Left Content Side */}
            <div className="flex-1 text-center md:text-left">

              {/* Status Header Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 rounded-full px-3 py-0.5 backdrop-blur-md shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
                  </span>
                  <Sparkles size={11} className="text-amber-300" />
                  <span className="text-amber-200 text-[10px] font-black uppercase tracking-[0.15em]">
                    {isSaturday ? '🔥 LIVE SATURDAY EXCLUSIVE' : '✨ SATURDAY OFFER'}
                  </span>
                </div>

                {/* Countdown */}
                <div className="inline-flex items-center gap-1 bg-black/40 border border-white/10 rounded-full px-2.5 py-0.5 text-white/90 text-[11px] font-mono backdrop-blur-md">
                  <Clock size={11} className="text-amber-400" />
                  <span>
                    {isSaturday ? 'Ends:' : 'Starts:'} {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>

              {/* Compact Headline & Discount line */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                  SATURDAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400">SPECIAL</span>
                </h2>
                <div className="flex items-center gap-2 bg-black/20 border border-amber-300/30 rounded-xl px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-brand-serif leading-none">
                    30% OFF
                  </span>
                  <span className="text-white/90 text-[11px] font-extrabold uppercase tracking-wider">
                    ALL TEAS
                  </span>
                </div>
              </div>

              {/* Feature Chips Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/80">
                  <Calendar size={11} className="text-amber-300" /> Every Saturday
                </span>
                <span className="text-white/40">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/80">
                  <Flame size={11} className="text-amber-300" /> Auto Applied
                </span>
                <span className="text-white/40">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/80">
                  <ShieldCheck size={11} className="text-amber-300" /> Dine-In & Takeaway
                </span>
              </div>



            </div>



          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SaturdayOfferBanner;