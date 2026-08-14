import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, Star, Gift, Sparkles } from 'lucide-react';

export const SaturdayOfferBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isSaturday, setIsSaturday] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const day = now.getDay();
      const saturday = day === 6;
      setIsSaturday(saturday);

      if (saturday) {
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
    <div className="w-full max-w-7xl mx-auto space-y-6 my-8 px-4 sm:px-6">
      {/* ─────────────────────────────────────────────────────────────
          OFFER CARD 1: SATURDAY SPECIAL (30% OFF ALL TEAS)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-[#FFF0F2] via-[#FDF2F4] to-[#FFF5F6] dark:from-[#2A1215] dark:via-[#1F0E10] dark:to-[#2D1418] border border-rose-200/80 dark:border-rose-900/40 rounded-3xl shadow-lg shadow-rose-900/5 overflow-hidden flex flex-col md:flex-row items-center justify-between"
      >
        {/* Left Side: Product Feature Image with Curved Backdrop */}
        <div className="relative w-full md:w-1/4 h-48 md:h-56 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/60 to-rose-100/30 dark:from-rose-900/30 dark:to-rose-950/20 md:rounded-r-[100px] rounded-b-[60px] md:rounded-b-none pointer-events-none" />
          <div className="relative z-10 w-36 h-36 md:w-44 md:h-44 group">
            <img
              src="/images/products/Matka Tea.png"
              alt="GENZCHIYA Matka Tea"
              className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/Milk Tea.jpg';
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md border border-rose-200 text-[10px] font-black text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full shadow-sm">
              Matka Chai
            </div>
          </div>
        </div>

        {/* Middle Content Section */}
        <div className="flex-1 p-6 text-center md:text-left space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#B8162F] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
            <Star size={11} className="fill-white" />
            <span>SATURDAY SPECIAL</span>
          </div>

          <div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-brand-serif leading-none">
              30% OFF <span className="text-[#B8162F] dark:text-rose-400">ALL TEAS</span>
            </h3>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Every Saturday</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black">✓</span>
              Auto Applied
            </span>
          </div>
        </div>

        {/* Right Side: Countdown Timer & Accent Image */}
        <div className="w-full md:w-auto p-6 flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-end z-10">
          {/* Live Countdown Box */}
          <div className="bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md border border-rose-200/80 dark:border-rose-900/50 rounded-2xl p-4 shadow-sm text-center min-w-[210px]">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2">
              <Clock size={12} className="text-[#B8162F] dark:text-rose-400" />
              <span>{isSaturday ? 'OFFER ENDS IN' : 'OFFER STARTS IN'}</span>
            </div>

            <div className="flex items-center justify-center gap-2 font-mono text-slate-900 dark:text-white">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#B8162F] dark:text-rose-400">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Hours</span>
              </div>
              <span className="text-xl font-bold text-slate-300 dark:text-slate-600 -mt-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#B8162F] dark:text-rose-400">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Minutes</span>
              </div>
              <span className="text-xl font-bold text-slate-300 dark:text-slate-600 -mt-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#B8162F] dark:text-rose-400">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Seconds</span>
              </div>
            </div>
          </div>

          {/* Secondary Product Accent Image */}
          <div className="hidden lg:block relative w-28 h-28 shrink-0">
            <img
              src="/images/products/Lemon Tea.jpg"
              alt="Lemon Tea"
              className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white dark:border-brand-dark-border transform rotate-3 hover:rotate-0 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/Green Tea.jpg';
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          OFFER CARD 2: SPECIAL OFFER (BUY 5 GET 1 FREE)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative bg-gradient-to-r from-[#FFFBEF] via-[#FFFDF5] to-[#FFF8E7] dark:from-[#2B2312] dark:via-[#1F190B] dark:to-[#2D240E] border border-amber-200/80 dark:border-amber-900/40 rounded-3xl shadow-lg shadow-amber-900/5 overflow-hidden flex flex-col md:flex-row items-center justify-between"
      >
        {/* Left Side: Product Spread Image */}
        <div className="relative w-full md:w-1/4 h-48 md:h-56 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/60 to-amber-100/30 dark:from-amber-900/30 dark:to-amber-950/20 md:rounded-r-[100px] rounded-b-[60px] md:rounded-b-none pointer-events-none" />
          <div className="relative z-10 w-36 h-36 md:w-44 md:h-44 group">
            <img
              src="/images/matka_chai.png"
              alt="GENZCHIYA Special Spread"
              className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/Masala Tea.jpg';
              }}
            />
            <div className="absolute -bottom-1 -left-1 bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md border border-amber-200 text-[10px] font-black text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full shadow-sm">
              Organic Selection
            </div>
          </div>
        </div>

        {/* Middle Content Section */}
        <div className="flex-1 p-6 text-center md:text-left space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#D4A055] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
            <Gift size={12} className="fill-white" />
            <span>SPECIAL OFFER</span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-brand-serif leading-tight">
              Buy 5 cups of the same item, <span className="text-[#D97706] dark:text-amber-400">get 1 FREE</span>
            </h3>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Everyday deal</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black">✓</span>
              Auto Applied in cart
            </span>
          </div>
        </div>

        {/* Right Side: 5 Cups + 1 FREE Visualization */}
        <div className="w-full md:w-auto p-6 flex flex-col items-center md:items-end justify-center z-10">
          {/* Auto Applied Tag */}
          <div className="mb-3 inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
            <Sparkles size={12} className="text-amber-600" />
            <span>AUTO APPLIED</span>
          </div>

          {/* 5 Cups + 1 Free Cup Line-Up */}
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-brand-dark-card/80 backdrop-blur-sm border border-amber-200/80 dark:border-amber-900/50 p-2.5 rounded-2xl shadow-sm">
            {/* 5 Purchased Cups */}
            <div className="flex items-center -space-x-2 sm:space-x-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white dark:border-brand-dark-border shadow-xs shrink-0 bg-amber-50">
                  <img
                    src="/images/products/Milk Tea.jpg"
                    alt={`Cup ${num}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Plus Icon */}
            <span className="text-amber-600 dark:text-amber-400 font-black text-sm px-1">+</span>

            {/* 1 Free Cup in Glowing Badge */}
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-amber-500 shadow-md ring-4 ring-amber-400/20 shrink-0 bg-amber-100">
                <img
                  src="/images/products/Milk Tea.jpg"
                  alt="Free Cup"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-sm animate-bounce">
                FREE
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SaturdayOfferBanner;