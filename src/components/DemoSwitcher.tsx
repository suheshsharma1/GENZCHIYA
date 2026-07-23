import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  User, Monitor,
  Sparkles, Layers, ArrowRight, X
} from 'lucide-react';
import { SVGLogo } from './SVGLogo';

type RoleKey = 'customer' | 'cashier' | 'kitchen';

type Panel = {
  key: RoleKey;
  label: string;
  sublabel: string;
  route: string;
  icon: React.ElementType;
  accentColor: string;
  glowColor: string;
  badgeGradient: string;
  cardGradient: string;
  ringColor: string;
  description: string;
};

const PANELS: Panel[] = [
  {
    key: 'customer',
    label: 'Customer',
    sublabel: 'Menu & Order',
    route: '/menu',
    icon: User,
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.35)',
    badgeGradient: 'linear-gradient(135deg, #059669, #10b981)',
    cardGradient: 'linear-gradient(145deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 100%)',
    ringColor: 'rgba(16,185,129,0.4)',
    description: 'Browse menu, customize & place orders',
  },
  {
    key: 'cashier',
    label: 'Cashier & Kitchen',
    sublabel: 'Dashboard',
    route: '/admin',
    icon: Monitor,
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.35)',
    badgeGradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
    cardGradient: 'linear-gradient(145deg, rgba(139,92,246,0.12) 0%, rgba(124,58,237,0.06) 100%)',
    ringColor: 'rgba(139,92,246,0.4)',
    description: 'Manage orders, payments & history',
  },
];

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const BUBBLE = 60;
const POS_KEY = 'gc_demo_switcher_pos';
const DEFAULT_MARGIN_X = 18;
const DEFAULT_MARGIN_BOTTOM = 96;

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
    let targetRoute = panel.route;
    if (panel.key === 'customer') {
      const savedTable = localStorage.getItem('gc_active_table');
      targetRoute = savedTable ? `/menu?table=${savedTable}` : '/menu';
    }
    if (location.pathname + location.search !== targetRoute) {
      navigate(targetRoute);
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

  // Hide the switcher on staff/admin routes and the landing page
  const HIDDEN_ROUTES = ['/', '/login', '/admin', '/kitchen', '/qr-tables'];
  if (HIDDEN_ROUTES.some(r => location.pathname === r || location.pathname.startsWith(r + '/'))) {
    return null;
  }

  return (
    <div
      data-demo-switcher
      className="fixed z-[9999] select-none"
      style={{ left: pos?.x ?? defaultPos().x, top: pos?.y ?? defaultPos().y }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="absolute bottom-[76px] right-0 origin-bottom-right"
            style={{ width: 268 }}
          >
            {/* Light frosted card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.96)',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: 20,
                boxShadow: '0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
                backdropFilter: 'blur(24px)',
                overflow: 'hidden',
              }}
            >
              {/* Header — soft gradient top */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f8f5ff 0%, #f0fdf8 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  padding: '13px 14px 11px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #ede9fe, #d1fae5)',
                        border: '1px solid rgba(139,92,246,0.15)',
                        borderRadius: 10,
                        padding: '5px 7px',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Sparkles size={11} style={{ color: '#8b5cf6' }} />
                      <SVGLogo variant="icon" size={15} />
                    </div>
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: '#8b5cf6', textTransform: 'uppercase', lineHeight: 1 }}>Demo Mode</p>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', lineHeight: 1.4, marginTop: 2 }}>GENZCHIYA POS</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    title="Close"
                    style={{
                      width: 25, height: 25, borderRadius: 8,
                      background: 'rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#94a3b8',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
                <div
                  style={{
                    marginTop: 9, padding: '5px 8px', borderRadius: 7,
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <Layers size={10} style={{ color: '#94a3b8', flexShrink: 0 }} />
                  <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Switch perspective to explore the system</p>
                </div>
              </div>

              {/* Role Cards */}
              <div style={{ padding: '10px 10px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: 7, paddingLeft: 3 }}>Choose a Role</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {PANELS.map((panel, i) => {
                    const isActive = userRole === panel.key;
                    const Icon = panel.icon;
                    return (
                      <motion.button
                        key={panel.key}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 360, damping: 28 }}
                        onClick={() => switchTo(panel)}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          width: '100%',
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 11px',
                          borderRadius: 12,
                          border: `1.5px solid ${isActive ? panel.ringColor : '#e9eef4'}`,
                          background: isActive ? panel.cardGradient : '#f8fafc',
                          cursor: 'pointer', textAlign: 'left',
                          position: 'relative', overflow: 'hidden',
                          boxShadow: isActive
                            ? `0 4px 16px ${panel.glowColor}, inset 0 1px 0 rgba(255,255,255,0.8)`
                            : '0 1px 3px rgba(0,0,0,0.05)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {/* Accent stripe */}
                        {isActive && (
                          <motion.div
                            layoutId="active-stripe"
                            style={{
                              position: 'absolute', left: 0, top: 0, bottom: 0,
                              width: 3, borderRadius: '3px 0 0 3px',
                              background: panel.badgeGradient,
                            }}
                          />
                        )}
                        {/* Icon badge */}
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: isActive ? panel.badgeGradient : '#fff',
                            border: `1px solid ${isActive ? 'rgba(255,255,255,0.4)' : '#e2e8f0'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: isActive ? `0 4px 12px ${panel.glowColor}` : '0 1px 4px rgba(0,0,0,0.07)',
                          }}
                        >
                          <Icon size={16} style={{ color: isActive ? '#fff' : panel.accentColor }} />
                        </div>
                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.01em', lineHeight: 1 }}>{panel.label}</p>
                            {isActive && (
                              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: panel.badgeGradient, color: '#fff', padding: '2px 5px', borderRadius: 99, lineHeight: 1.5 }}>Active</span>
                            )}
                          </div>
                          <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>{panel.description}</p>
                        </div>
                        <ArrowRight size={13} style={{ color: isActive ? panel.accentColor : '#d1d5db', flexShrink: 0 }} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '7px 14px 11px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }} />
                <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.03em' }}>Switch Demo Role — Drag to reposition</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble */}
      <motion.div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={handleBubbleClick}
        whileTap={{ scale: 0.88 }}
        className="touch-none cursor-grab active:cursor-grabbing"
        style={{ width: BUBBLE, height: BUBBLE, position: 'relative' }}
      >
        {/* Soft glow ring */}
        <motion.div
          animate={{ scale: open ? 1.16 : [1, 1.08, 1] }}
          transition={open ? { duration: 0.2 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            background: `radial-gradient(circle, ${activePanel.glowColor} 0%, transparent 70%)`,
            opacity: 0.4,
          }}
        />
        {/* Main bubble — white/light */}
        <div
          style={{
            width: BUBBLE, height: BUBBLE, borderRadius: '50%',
            background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
            border: `2px solid ${open ? activePanel.accentColor : '#e2e8f0'}`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)${open ? `, 0 0 18px ${activePanel.glowColor}` : ''}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.95) 0%, transparent 60%)' }} />
          <SVGLogo variant="icon" size={32} onClick={(e: React.MouseEvent) => e.stopPropagation()} />
          {/* Role dot */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: 3, right: 3,
              width: 11, height: 11, borderRadius: '50%',
              background: activePanel.accentColor,
              border: '2px solid #fff',
              boxShadow: `0 0 6px ${activePanel.accentColor}`,
            }}
          />
        </div>
        {/* Role label badge */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              style={{
                position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
                background: activePanel.badgeGradient,
                borderRadius: 99, padding: '1px 6px',
                fontSize: 8, fontWeight: 800, color: '#fff',
                whiteSpace: 'nowrap',
                boxShadow: `0 2px 6px ${activePanel.glowColor}`,
                letterSpacing: '0.05em', textTransform: 'uppercase',
                border: '1.5px solid rgba(255,255,255,0.7)',
              }}
            >
              {activePanel.label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DemoSwitcher;
