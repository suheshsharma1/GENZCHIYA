import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SteamParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

const steamParticles: SteamParticle[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 30 + Math.random() * 40,
  y: 10 + Math.random() * 20,
  size: 4 + Math.random() * 6,
  opacity: 0.15 + Math.random() * 0.25,
  duration: 2.5 + Math.random() * 3,
  delay: Math.random() * 2,
  drift: -8 + Math.random() * 16,
}));

const leafPositions = [
  { x: -8, y: 20, rotation: -15, scale: 0.7 },
  { x: 105, y: 60, rotation: 25, scale: 0.5 },
  { x: -5, y: 70, rotation: -30, scale: 0.4 },
  { x: 110, y: 25, rotation: 10, scale: 0.6 },
];

export const PromoCard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.92 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-sm mx-auto lg:mx-0"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[24px] overflow-hidden"
      >
        {/* Glassmorphism card */}
        <div className="relative bg-gradient-to-br from-[#E4002B] via-[#c20022] to-[#E4002B] rounded-[24px] shadow-2xl shadow-black/20 border border-white/10 p-6 sm:p-7 backdrop-blur-sm">
          {/* Decorative abstract shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FAF7F2]/5 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

          {/* Tea leaves decorations */}
          {leafPositions.map((leaf, i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${leaf.x}%`,
                top: `${leaf.y}%`,
                transform: `rotate(${leaf.rotation}deg) scale(${leaf.scale})`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8 6 4 10 4 14c0 4 3.6 7 8 7s8-3 8-7c0-4-4-8-8-12z"
                  fill="#FAF7F2"
                  opacity="0.6"
                />
                <path d="M12 6C10 9 8 11 8 13c0 2 2 4 4 4s4-2 4-4c0-2-2-4-4-6z" fill="#EFE6DA" opacity="0.5" />
              </svg>
            </div>
          ))}

          {/* Badge */}
          <div className="relative z-10 flex justify-center mb-4">
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center gap-1.5 bg-[#E4002B]/20 border border-[#E4002B]/30 rounded-full px-4 py-1.5"
            >
              <span className="text-[#E4002B] text-xs">🔥</span>
              <span className="text-[#E4002B] text-[10px] font-black uppercase tracking-[0.2em]">
                Saturday Special
              </span>
            </motion.span>
          </div>

          {/* Tea Cup Illustration */}
          <div className="relative z-10 flex justify-center mb-5">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Cup body */}
              <div className="w-20 h-24 rounded-b-3xl rounded-t-lg bg-gradient-to-b from-[#FAF7F2] to-[#EFE6DA] shadow-lg relative overflow-hidden">
                {/* Cup rim */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#FAF7F2] rounded-full border-2 border-[#EFE6DA]" />
                {/* Cup handle */}
                <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-5 h-10 border-2 border-[#EFE6DA] border-l-0 rounded-r-full" />
                {/* Tea inside */}
                <div className="absolute bottom-3 left-3 right-3 h-8 rounded-full bg-gradient-to-t from-[#E4002B] to-[#c20022] opacity-80" />
                {/* Steam lines on tea */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#E4002B]/30 rounded-full" />
              </div>

              {/* Steam particles */}
              {steamParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute bg-white/40 rounded-full"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                  }}
                  animate={{
                    y: [0, -30 - Math.random() * 20],
                    x: [0, particle.drift],
                    opacity: [particle.opacity, 0],
                    scale: [1, 0.3],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    repeatDelay: particle.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative z-10 text-center mb-1"
          >
            <span className="text-5xl sm:text-6xl font-black text-[#E4002B] font-brand-serif tracking-tight leading-none">
              30% OFF
            </span>
          </motion.div>

          {/* Sub Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-10 text-center mb-3"
          >
            <span className="text-[#FAF7F2] text-sm font-bold uppercase tracking-[0.15em]">
              All Tea Items
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative z-10 text-center text-white/70 text-xs leading-relaxed mb-5 space-y-1"
          >
            <span>Enjoy 30% OFF on all tea items every Saturday.</span>
            <br />
            <span className="text-white/50">No coupon required. Offer applied automatically.</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative z-10 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(228,0,43,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#E4002B] hover:bg-[#c20022] text-white font-black py-3 px-8 rounded-2xl text-xs uppercase tracking-widest shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <span>Order Now</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        {/* Floating glow behind card */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-br from-[#E4002B]/20 via-transparent to-[#c20022]/20 rounded-[32px] blur-2xl -z-10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default PromoCard;