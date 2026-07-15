import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  User, Monitor, ChefHat, 
  ChevronDown, Sparkles, Shield 
} from 'lucide-react';

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

export const DemoSwitcher: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { userRole, setUserRole: _setUserRole } = useApp();
  const location = useLocation();

  const activePanel = PANELS.find(p => p.key === userRole) ?? PANELS[0];

  const switchTo = (panel: Panel) => {
    localStorage.setItem('gc_user_role', panel.key);
    setOpen(false);
    window.location.href = panel.route;
  };

  if (location.pathname === '/') return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] select-none font-sans">
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            {/* Panel Card */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className="mb-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden w-72"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                </div>
                <div className="relative flex items-center gap-2.5">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Demo Mode</p>
                    <p className="text-sm font-black text-white tracking-tight">GENZCHIYA System</p>
                  </div>
                </div>
              </div>

              {/* Role Options */}
              <div className="p-3 space-y-2">
                {PANELS.map((panel) => {
                  const isActive = userRole === panel.key;
                  const Icon = panel.icon;
                  return (
                    <button
                      key={panel.key}
                      onClick={() => switchTo(panel)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer text-left relative overflow-hidden group ${
                        isActive
                          ? `${panel.activeBg} text-white shadow-lg`
                          : `bg-gradient-to-br ${panel.gradient} hover:scale-[1.02] border ${panel.border}`
                      }`}
                    >
                      {/* Active shimmer effect */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      )}

                      <div className={`p-2 rounded-xl shrink-0 ${
                        isActive ? 'bg-white/20' : `bg-white dark:bg-slate-800`
                      }`}>
                        <Icon size={18} className={isActive ? 'text-white' : `text-slate-700 dark:text-slate-200`} />
                      </div>

                      <div className="flex-1 min-w-0 relative z-10">
                        <p className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                          {panel.label}
                        </p>
                        <p className={`text-[10px] font-medium leading-tight ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                          {panel.description}
                        </p>
                      </div>

                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="flex items-center gap-1.5 relative z-10"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">
                            Active
                          </span>
                        </motion.div>
                      )}

                      {!isActive && (
                        <div className={`w-2 h-2 rounded-full ${panel.dotColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center justify-center gap-1.5">
                  <Shield size={10} className="text-slate-400" />
                  <p className="text-[9px] text-slate-400 font-medium">
                    Development Preview Build
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Trigger FAB */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white shadow-2xl shadow-black/40 border border-white/10 cursor-pointer group relative overflow-hidden"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <div className="relative z-10 flex items-center gap-3">
          {/* Active role indicator */}
          <div className="relative">
            <div className={`p-2 rounded-xl ${activePanel.activeBg} shadow-lg`}>
              <activePanel.icon size={18} className="text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${activePanel.dotColor} border-2 border-slate-900`}
            />
          </div>

          {/* Label */}
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-wider leading-tight">
              {activePanel.label}
            </p>
            <p className="text-[9px] text-slate-400 font-medium leading-tight">
              {activePanel.sublabel}
            </p>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <ChevronDown size={16} className="text-slate-400" />
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
};

export default DemoSwitcher;
