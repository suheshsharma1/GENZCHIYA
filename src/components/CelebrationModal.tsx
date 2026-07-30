import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

type CelebrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
};

type Particle = {
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
};

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

const ConfettiCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // spawn burst
    const particles: Particle[] = [];
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 4 + Math.random() * 6,
        speedX: (Math.random() - 0.5) * 14,
        speedY: -(Math.random() * 16 + 4),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
      });
    }
    particlesRef.current = particles;

    let start = performance.now();
    const duration = 4500; // 4.5s

    const animate = (now: number) => {
      const elapsed = now - start;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.35; // gravity
        p.rotation += p.rotationSpeed;
        if (elapsed > duration - 800) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ isOpen, onClose, message }) => {
  const defaultMessage = 'Congratulations! 🎉 You got a 1 cup free — 5th tea is on us!';
  const displayMessage = message || defaultMessage;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <ConfettiCanvas active={isOpen} />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-3xl shadow-2xl border border-slate-100 dark:border-brand-dark-border/60 overflow-hidden z-10"
          >
            <div className="p-6 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', damping: 14, stiffness: 200 }}
                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-brand-emerald to-emerald-400 dark:from-brand-amber dark:to-yellow-400 flex items-center justify-center shadow-lg mb-4"
              >
                <PartyPopper className="text-white" size={28} />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-xl font-black text-slate-800 dark:text-white tracking-tight"
              >
                🎉 Congratulations!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
              >
                {displayMessage}
              </motion.p>

              <div className="mt-5">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-brand-emerald dark:bg-brand-amber hover:bg-brand-sage dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg text-[11px] font-bold shadow-lg shadow-brand-emerald/20 transition-colors cursor-pointer"
                >
                  Got it!
                </button>
              </div>
            </div>

            {/* subtle success pulse */}
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-brand-emerald/30 dark:border-brand-amber/30"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
