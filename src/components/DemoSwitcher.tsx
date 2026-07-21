import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  User, Monitor,
  Sparkles, Shield, X
} from 'lucide-react';
import { SVGLogo } from './SVGLogo';

type Panel = {
  key: 'customer' | 'cashier' | 'kitchen';
  label: string;
  sublabel: string;
  route: string;
  icon: React.ElementType;
  gradient: string;
  border: string;
  activeBg: string;
  dotColor: string;
  description: string;
};

const PANELS: Panel[] = [
  {
    key: 'customer',
    label: 'Customer',
    sublabel: 'Menu & Order',
    route: '/menu?table=5',
    icon: User,
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-500/20',
    activeBg: 'bg-emerald-500',
    dotColor: 'bg-emerald-400',
    description: 'Browse menu, customize & order'
  },
  {
    key: 'cashier',
    label: 'Cashier & Kitchen',
    sublabel: 'Dashboard',
    route: '/admin',
    icon: Monitor,
    gradient: 'from-violet-500/10 to-purple-500/10',
    border: 'border-violet-500/20',
    activeBg: 'bg-violet-500',
    dotColor: 'bg-violet-400',
    description: 'Manage orders & payments'
  },
];

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const BUBBLE = 56; // bubble diameter
const POS_KEY = 'gc_demo_switcher_pos';
const DEFAULT_MARGIN_X = 16;
const DEFAULT_MARGIN_BOTTOM = 88;

export const DemoSwitcher: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { userRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const activePanel = PANELS.find(p => p.key === userRole) ?? PANELS[0];

  // Draggable position (top-left of the bubble). Persisted across the page session + reload.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const offsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const posRef = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => { posRef.current = pos; }, [pos]);

  const defaultPos = useCallback(() => ({
    x: clamp(window.innerWidth - BUBBLE - DEFAULT_MARGIN_X, 8, window.innerWidth - BUBBLE - 8),
    y: clamp(window.innerHeight - BUBBLE - DEFAULT_MARGIN_BOTTOM, 8, window.innerHeight - BUBBLE - 8)
  }), []);

  // Load saved position (or default), then keep it in sync with the viewport.
  useEffect(() => {
    let initial = defaultPos();
    try {
      const saved = localStorage.getItem(POS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') initial = parsed;
      }
    } catch { /* ignore corrupt value */ }
    setPos(initial);

    const onResize = () => {
      const cur = posRef.current ?? defaultPos();
      setPos({
        x: clamp(cur.x, 8, window.innerWidth - BUBBLE - 8),
        y: clamp(cur.y, 8, window.innerHeight - BUBBLE - 8)
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [defaultPos]);

  const persistPos = useCallback((p: { x: number; y: number }) => {
    try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch { /* ignore */ }
  }, []);

  const switchTo = (panel: Panel) => {
    localStorage.setItem('gc_user_role', panel.key);
    setOpen(false);
    if (location.pathname + location.search !== panel.route) {
      navigate(panel.route);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (open) return; // don't drag while the panel is open
    draggingRef.current = true;
    movedRef.current = false;
    const cur = posRef.current ?? defaultPos();
    offsetRef.current = { dx: e.clientX - cur.x, dy: e.clientY - cur.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    movedRef.current = true;
    const next = {
      x: clamp(e.clientX - offsetRef.current.dx, 8, window.innerWidth - BUBBLE - 8),
      y: clamp(e.clientY - offsetRef.current.dy, 8, window.innerHeight - BUBBLE - 8)
    };
    setPos(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const wasDragging = draggingRef.current;
    draggingRef.current = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
    const cur = posRef.current;
    if (cur) persistPos(cur);
    // Suppress the click that follows a drag so the bubble doesn't toggle open
    if (wasDragging && movedRef.current) {
      e.stopPropagation();
    }
  };

  const handleBubbleClick = () => {
    if (movedRef.current) { movedRef.current = false; return; }
    setOpen(prev => !prev);
  };

  // Collapse when clicking outside the expanded panel
  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-demo-switcher]')) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [open]);

  if (location.pathname === '/') return null;

  return (
    <div
      data-demo-switcher
      className="fixed z-[9999] select-none font-sans"
      style={{ left: pos?.x ?? defaultPos().x, top: pos?.y ?? defaultPos().y }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="absolute bottom-[64px] right-0 w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="px-3.5 py-2.5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden flex items-center justify-between">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
              </div>
              <div className="relative flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Sparkles size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400">Demo Mode</p>
                  <p className="text-xs font-black text-white tracking-tight">GENZCHIYA System</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                title="Close"
                className="relative z-10 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>

            {/* Role Options */}
            <div className="p-2 space-y-1.5">
              {PANELS.map((panel) => {
                const isActive = userRole === panel.key;
                const Icon = panel.icon;
                return (
                  <button
                    key={panel.key}
                    onClick={() => switchTo(panel)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer text-left relative overflow-hidden group ${
                      isActive
                        ? `${panel.activeBg} text-white shadow`
                        : `bg-gradient-to-br ${panel.gradient} hover:scale-[1.02] border ${panel.border}`
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-white/20' : 'bg-white dark:bg-slate-800'}`}>
                      <Icon size={15} className={isActive ? 'text-white' : 'text-slate-700 dark:text-slate-200'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                        {panel.label}
                      </p>
                      <p className={`text-[9px] font-medium leading-tight ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {panel.description}
                      </p>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-3.5 py-2 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-center gap-1.5">
                <Shield size={9} className="text-slate-400" />
                <p className="text-[8px] text-slate-400 font-medium">Development Preview Build</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular chat-head bubble (icon only, draggable) */}
      <motion.div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={handleBubbleClick}
        whileTap={{ scale: 0.92 }}
        animate={draggingRef.current ? { scale: 1.08 } : { scale: 1 }}
        className="relative touch-none cursor-grab active:cursor-grabbing"
        style={{ width: BUBBLE, height: BUBBLE }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-2xl shadow-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
          <SVGLogo variant="icon" size={34} onClick={(e) => e.stopPropagation()} />
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute top-1 right-1 w-3 h-3 rounded-full ${activePanel.dotColor} border-2 border-white`}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default DemoSwitcher;
