import React, { useState, useEffect } from 'react';
import { Clock, Star, Gift, Sparkles, Check } from 'lucide-react';

export const CompactOffers: React.FC = () => {
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
    <div className="w-full mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* ─────────────────────────────────────────────────────────────
            CARD 1: SATURDAY SPECIAL CARD
            ───────────────────────────────────────────────────────────── */}
        <div className="group relative bg-gradient-to-r from-[#FFF0F2] via-[#FDF2F4] to-[#FFF5F6] dark:from-[#2A1215] dark:via-[#1F0E10] dark:to-[#2D1418] border border-rose-200/90 dark:border-rose-900/50 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center justify-between gap-3 min-h-[140px] sm:min-h-[160px]">
          {/* Ambient Lighting Glow */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-400/20 dark:bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Product Image with Overlapping Badge */}
          <div className="relative w-22 h-22 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-rose-100 dark:bg-rose-950/60 border border-rose-200/80 shadow-md group-hover:scale-105 transition-transform duration-500">
              <img
                src="/images/products/Matka Tea.png"
                alt="GENZCHIYA Matka Tea"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/Milk Tea.jpg';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md text-[#B8162F] dark:text-rose-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-rose-200/80 shadow-xs">
              Matka Tea
            </span>
          </div>

          {/* Middle: Main Offer Text */}
          <div className="flex-1 space-y-1 z-10">
            <div className="inline-flex items-center gap-1 bg-[#B8162F] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              <Star size={10} className="fill-white" />
              <span>SATURDAY SPECIAL</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                30% OFF
              </h3>
              <p className="text-sm sm:text-base font-black text-[#B8162F] dark:text-rose-400 tracking-tight leading-snug">
                ALL TEAS
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <span>Every Saturday</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black">✓</span>
                Auto Applied
              </span>
            </div>
          </div>

          {/* Right: Live Countdown Box */}
          <div className="bg-white/95 dark:bg-brand-dark-card/95 backdrop-blur-md border border-rose-200/80 dark:border-rose-900/60 rounded-2xl p-2.5 text-center shrink-0 shadow-xs z-10 min-w-[95px] sm:min-w-[110px]">
            <div className="flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
              <Clock size={10} className="text-[#B8162F] dark:text-rose-400" />
              <span>{isSaturday ? 'ENDS IN' : 'STARTS IN'}</span>
            </div>

            <div className="font-mono text-xs sm:text-sm font-black text-[#B8162F] dark:text-rose-400 leading-tight">
              <div>{String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m</div>
              <div className="text-[10px] text-slate-500 font-bold mt-0.5">{String(timeLeft.seconds).padStart(2, '0')}s</div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CARD 2: BUY 5 GET 1 FREE CARD
            ───────────────────────────────────────────────────────────── */}
        <div className="group relative bg-gradient-to-r from-[#FFFBEF] via-[#FFFDF5] to-[#FFF8E7] dark:from-[#2B2312] dark:via-[#1F190B] dark:to-[#2D240E] border border-amber-200/90 dark:border-amber-900/50 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center justify-between gap-3 min-h-[140px] sm:min-h-[160px]">
          {/* Ambient Lighting Glow */}
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Product Image */}
          <div className="relative w-22 h-22 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-amber-100 dark:bg-amber-950/60 border border-amber-200/80 shadow-md group-hover:scale-105 transition-transform duration-500">
              <img
                src="/images/products/Milk Tea.jpg"
                alt="GENZCHIYA Milk Tea"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/Masala Tea.jpg';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -left-1 bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md text-amber-800 dark:text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-200/80 shadow-xs">
              Milk Tea
            </span>
          </div>

          {/* Middle: Main Offer Text */}
          <div className="flex-1 space-y-1 z-10">
            <div className="inline-flex items-center gap-1 bg-[#D4A055] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              <Gift size={10} className="fill-white" />
              <span>SPECIAL OFFER</span>
            </div>

            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                BUY 5 GET 1 FREE
              </h3>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 line-clamp-1">
                Buy 5 cups of same item, get 1 free.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <span>Everyday deal</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black">✓</span>
                Auto Applied
              </span>
            </div>
          </div>

          {/* Right: 5 Cups Visual Strip */}
          <div className="flex flex-col items-end justify-center z-10 shrink-0">
            <div className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300/80 mb-1.5 shadow-xs">
              <Sparkles size={10} className="text-amber-600" />
              <span>AUTO DEAL</span>
            </div>

            <div className="flex items-center gap-1 bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md border border-amber-200/80 dark:border-amber-900/60 p-1.5 rounded-xl shadow-xs">
              <div className="flex items-center -space-x-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full overflow-hidden border border-white dark:border-brand-dark-border bg-amber-100 shrink-0">
                    <img src="/images/products/Milk Tea.jpg" alt="cup" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-amber-600 px-0.5">+</span>
              <div className="relative">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-500 bg-amber-200 shrink-0">
                  <img src="/images/products/Milk Tea.jpg" alt="free cup" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -top-1.5 -right-1 bg-amber-600 text-white text-[7px] font-black px-1 rounded-full">
                  FREE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactOffers;
