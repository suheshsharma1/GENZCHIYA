import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const steamParticles: SteamParticle[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 20 + Math.random() * 60,
  y: 5 + Math.random() * 20,
  size: 2 + Math.random() * 4,
  opacity: 0.1 + Math.random() * 0.2,
  duration: 2.5 + Math.random() * 3,
  delay: Math.random() * 2,
  drift: -8 + Math.random() * 16,
}));

export const SaturdayOfferBanner: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[28px] overflow-hidden shadow-premium-lg"
      >
        {/* Red Gradient Background */}
        <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-primary overflow-hidden">

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-accent/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

          {/* Gold decorative dots top right */}
          <div className="absolute top-4 right-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-brand-accent/40" />
            ))}
          </div>
          <div className="absolute bottom-4 left-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-accent/30" />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-8 sm:p-10 lg:p-12">

            {/* Left Side - Text Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center gap-1.5 bg-brand-accent/20 border border-brand-accent/30 rounded-full px-4 py-1.5 mb-4"
              >
                <Sparkles size={10} className="text-brand-accent" />
                <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.2em]">
                  Limited Time Offer
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2"
              >
                SATURDAY SPECIAL
              </motion.h2>

              {/* Discount */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-4"
              >
                <span className="text-6xl sm:text-7xl font-black text-brand-accent font-brand-serif tracking-tight leading-none">
                  30% OFF
                </span>
                <span className="text-white/80 text-lg font-bold ml-2 uppercase tracking-wider">
                  All Tea Items
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-white/80 text-sm leading-relaxed mb-5 max-w-md"
              >
                Enjoy 30% OFF on all tea items every Saturday.
                No coupon required. Automatically applied.
              </motion.p>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6"
              >
                <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
                  <Calendar size={12} />
                  <span>Every Saturday</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
                  <Clock size={12} />
                  <span>8 AM – 8 PM</span>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,209,102,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/menu?category=tea')}
                className="bg-white text-brand-primary hover:bg-brand-accent font-black py-3.5 px-8 rounded-2xl text-xs uppercase tracking-widest shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 mx-auto lg:mx-0"
              >
                <span>ORDER NOW</span>
                <ArrowRight size={16} />
              </motion.button>
            </div>

            {/* Right Side - Tea Cup Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 100 }}
              className="relative w-48 h-56 sm:w-56 sm:h-64 lg:w-64 lg:h-72 flex items-center justify-center"
            >
              {/* Wooden tray */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-4 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full shadow-lg" />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-48 h-2 bg-amber-600 rounded-full" />

              {/* Cup body */}
              <div className="relative w-36 h-44 rounded-b-3xl rounded-t-xl bg-gradient-to-b from-[#FFF8F6] to-[#F0E6D8] shadow-2xl overflow-hidden z-10">
                {/* Cup rim */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-44 h-5 bg-[#FFF8F6] rounded-full border-2 border-[#F0E6D8]" />
                {/* Cup handle */}
                <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-6 h-12 border-2 border-[#F0E6D8] border-l-0 rounded-r-full" />
                {/* Tea inside */}
                <div className="absolute bottom-5 left-5 right-5 h-10 rounded-full bg-gradient-to-t from-brand-primary to-brand-primary-dark opacity-60" />
                {/* GENZCHIYA logo on cup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-brand-primary font-black text-[10px] tracking-widest whitespace-nowrap">GENZCHIYA</span>
                </div>
                {/* Steam lines on tea surface */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-primary/20 rounded-full" />
              </div>

              {/* Steam particles */}
              {steamParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute bg-white/25 rounded-full"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                  }}
                  animate={{
                    y: [0, -50 - Math.random() * 30],
                    x: [0, particle.drift],
                    opacity: [particle.opacity, 0],
                    scale: [1, 0.2],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    repeatDelay: particle.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Floating gold particles */}
              <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-brand-accent/60 animate-float" />
              <div className="absolute -bottom-1 -left-3 w-2 h-2 rounded-full bg-brand-accent/40 animate-float" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/4 -right-4 w-2.5 h-2.5 rounded-full bg-brand-accent/50 animate-float" style={{ animationDelay: '2s' }} />
            </motion.div>
          </div>
        </div>

        {/* Glow behind card */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-accent/20 rounded-[32px] blur-2xl -z-10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SaturdayOfferBanner;