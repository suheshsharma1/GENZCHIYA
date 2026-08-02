import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, AlertTriangle, Users, CheckCircle2, Clock, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TableSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional message to display at the top of the modal (e.g. when opened
   * because the customer tried to add a product without selecting a table). */
  message?: string;
}

const RESERVED_TABLES = new Set(['13']);

export const TableSelectionModal: React.FC<TableSelectionModalProps> = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();
  const { activeTable, switchTable, orders, currentOrderId, totalTables, getTableStatus, cart, tableCartMap } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmTargetTable, setConfirmTargetTable] = useState<string | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const ALL_TABLES = useMemo(() => Array.from({ length: totalTables }, (_, i) => String(i + 1)), [totalTables]);

  const occupiedTables = useMemo(() => {
    const activeSet = new Set<string>();
    orders.forEach(o => {
      if (o.status !== 'served' && o.status !== 'completed' && o.status !== 'rejected') {
        if (o.tableNumber) activeSet.add(o.tableNumber);
      }
    });
    return activeSet;
  }, [orders]);

  const getEffectiveTableStatus = (tableNum: string): 'available' | 'occupied' => {
    const contextStatus = getTableStatus(tableNum);
    if (contextStatus === 'occupied') return 'occupied';
    if (occupiedTables.has(tableNum)) return 'occupied';
    return 'available';
  };

  // Consider the current table "locked" if:
  // (a) there is an active live order, OR
  // (b) the cart for this table is non-empty (items added but not yet placed)
  const currentTableHasActiveOrder = useMemo(() => {
    if (!activeTable) return false;
    // Check for a live order
    if (currentOrderId) {
      const activeOrder = orders.find(o => o.id === currentOrderId);
      if (activeOrder && !['served', 'completed', 'rejected'].includes(activeOrder.status)) return true;
    }
    if (occupiedTables.has(activeTable)) return true;
    // Also guard when the cart has items but no order has been placed yet
    const activeCartItems = tableCartMap?.[activeTable] ?? cart;
    return activeCartItems.length > 0;
  }, [activeTable, currentOrderId, orders, occupiedTables, cart, tableCartMap]);

  const filteredTables = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return ALL_TABLES;
    return ALL_TABLES.filter(t => t.includes(query) || `table ${t}`.toLowerCase().includes(query.toLowerCase()));
  }, [searchQuery, ALL_TABLES]);

  const availableCount = ALL_TABLES.filter(t => !RESERVED_TABLES.has(t) && getEffectiveTableStatus(t) === 'available').length;
  const occupiedCount = ALL_TABLES.filter(t => getEffectiveTableStatus(t) === 'occupied').length;

  const selectAndNavigate = (tableNum: string) => {
    switchTable(tableNum);
    navigate(`/menu?table=${tableNum}`, { replace: true });
    onClose();
  };

  const handleTableClick = (tableNum: string) => {
    if (tableNum === activeTable) { onClose(); return; }
    if (RESERVED_TABLES.has(tableNum)) return;
    if (currentTableHasActiveOrder) {
      setConfirmTargetTable(tableNum);
    } else {
      selectAndNavigate(tableNum);
    }
  };

  const handleConfirmSwitch = () => {
    if (confirmTargetTable) {
      selectAndNavigate(confirmTargetTable);
      setConfirmTargetTable(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Main Dialog */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-md z-10 my-auto"
        >
          {/* Card */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7)]"
            style={{ background: 'linear-gradient(160deg, #0f1923 0%, #162030 50%, #0d1a28 100%)' }}
          >
            {/* Ambient top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/8 rounded-full blur-[50px] pointer-events-none" />

            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-white/8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {/* Animated live dot */}
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Floor Status</span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Select Your Table
                  </h3>
                  {activeTable ? (
                    <p className="text-xs text-white/40 mt-0.5">
                      Currently seated at{' '}
                      <span className="text-amber-300 font-bold">Table #{activeTable}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-white/40 mt-0.5">Choose a table to begin your session</p>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/8 hover:bg-white/15 text-white/50 hover:text-white transition-all cursor-pointer flex-shrink-0 mt-0.5"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Stats row */}
              <div className="flex gap-3 mt-4">
                <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-xl px-3 py-1.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span className="text-emerald-300 text-[11px] font-bold">{availableCount} Free</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/20 rounded-xl px-3 py-1.5">
                  <Clock size={12} className="text-amber-400" />
                  <span className="text-amber-300 text-[11px] font-bold">{occupiedCount} Occupied</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/6 border border-white/10 rounded-xl px-3 py-1.5">
                  <Users size={12} className="text-white/50" />
                  <span className="text-white/50 text-[11px] font-bold">{totalTables} Total</span>
                </div>
              </div>
            </div>

            {/* Friendly message banner (shown when opened due to blocked add-to-cart) */}
            {message && (
              <div className="mx-5 mt-3 flex items-start gap-2.5 bg-amber-500/15 border border-amber-400/30 rounded-xl px-4 py-3">
                <Info size={15} className="text-amber-300 shrink-0 mt-0.5" />
                <p className="text-amber-200 text-xs font-semibold leading-relaxed">{message}</p>
              </div>
            )}

            {/* Search */}
            <div className="px-5 pt-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search table…"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white/6 border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 outline-none text-xs font-medium text-white placeholder:text-white/25 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Table Grid */}
            <div className="px-5 pb-5">
              <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="grid grid-cols-4 gap-2.5">
                  {filteredTables.map((tNum, idx) => {
                    const isCurrent = tNum === activeTable;
                    const isReserved = RESERVED_TABLES.has(tNum);
                    const effectiveStatus = getEffectiveTableStatus(tNum);
                    const isOccupied = effectiveStatus === 'occupied';
                    const isHovered = hoveredTable === tNum;

                    let cardBg = 'bg-white/6 border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10';
                    let numberColor = 'text-white';
                    let labelColor = 'text-white/35';
                    let dotColor = 'bg-emerald-400';
                    let statusText = 'Free';
                    let statusColor = 'text-emerald-400';
                    let glowClass = '';
                    let icon = <CheckCircle2 size={9} className="text-emerald-400" />;

                    if (isCurrent) {
                      cardBg = 'bg-gradient-to-br from-emerald-600/40 to-emerald-700/30 border-emerald-400/60';
                      numberColor = 'text-emerald-300';
                      labelColor = 'text-emerald-200/60';
                      dotColor = 'bg-emerald-300';
                      statusText = 'Yours';
                      statusColor = 'text-emerald-300';
                      glowClass = 'shadow-[0_0_18px_-4px_rgba(52,211,153,0.35)]';
                      icon = <CheckCircle2 size={9} className="text-emerald-300" />;
                    } else if (isReserved) {
                      cardBg = 'bg-rose-950/30 border-rose-800/40 cursor-not-allowed opacity-50';
                      numberColor = 'text-rose-400/60';
                      labelColor = 'text-rose-400/40';
                      dotColor = 'bg-rose-500';
                      statusText = 'Reserved';
                      statusColor = 'text-rose-400/70';
                      icon = <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 text-rose-400/70" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5"/><line x1="10.5" y1="5.5" x2="5.5" y2="10.5"/></svg>;
                    } else if (isOccupied) {
                      cardBg = 'bg-amber-950/30 border-amber-600/30 cursor-not-allowed opacity-70';
                      numberColor = 'text-amber-300/70';
                      labelColor = 'text-amber-400/50';
                      dotColor = 'bg-amber-400';
                      statusText = 'Busy';
                      statusColor = 'text-amber-400/80';
                      icon = <Clock size={9} className="text-amber-400/80" />;
                    }

                    return (
                      <motion.button
                        key={tNum}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.02, duration: 0.2 }}
                        onClick={() => handleTableClick(tNum)}
                        onMouseEnter={() => setHoveredTable(tNum)}
                        onMouseLeave={() => setHoveredTable(null)}
                        disabled={isReserved || isOccupied}
                        className={`relative flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border transition-all duration-200 cursor-pointer group ${cardBg} ${glowClass}`}
                      >
                        {/* Status dot top-right */}
                        <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${dotColor} ${isOccupied ? 'animate-pulse' : ''}`} />

                        {/* Table icon area */}
                        <div className={`w-7 h-7 mb-1.5 rounded-xl flex items-center justify-center transition-all ${
                          isCurrent ? 'bg-emerald-400/20' : 'bg-white/6 group-hover:bg-white/12'
                        }`}>
                          {/* Tiny table icon */}
                          <svg viewBox="0 0 20 20" fill="none" className={`w-4 h-4 ${isCurrent ? 'text-emerald-300' : isOccupied ? 'text-amber-300/60' : isReserved ? 'text-rose-400/50' : 'text-white/40 group-hover:text-emerald-300'} transition-colors`}>
                            <rect x="2" y="7" width="16" height="2.5" rx="1.25" fill="currentColor" />
                            <rect x="5" y="9.5" width="1.8" height="5" rx="0.9" fill="currentColor" />
                            <rect x="13.2" y="9.5" width="1.8" height="5" rx="0.9" fill="currentColor" />
                          </svg>
                        </div>

                        <span className={`text-[9px] uppercase font-bold tracking-wider ${labelColor}`}>Table</span>
                        <span className={`text-base font-black leading-none ${numberColor}`}>{tNum}</span>
                        <div className={`flex items-center gap-0.5 mt-1 ${statusColor}`}>
                          {icon}
                          <span className={`text-[8px] font-semibold`}>{statusText}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend footer */}
            <div className="px-6 py-3 border-t border-white/6 flex items-center justify-center gap-4">
              {[
                { dot: 'bg-emerald-400', label: 'Available' },
                { dot: 'bg-amber-400 animate-pulse', label: 'Occupied' },
                { dot: 'bg-rose-500', label: 'Reserved' },
              ].map(({ dot, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  <span className="text-[10px] text-white/30 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Switch confirmation overlay */}
          <AnimatePresence>
            {confirmTargetTable && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 text-center"
                style={{ background: 'rgba(10,17,26,0.97)', backdropFilter: 'blur(12px)' }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05, type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-5"
                >
                  <AlertTriangle size={28} className="text-amber-400" />
                </motion.div>

                <h4 className="text-base font-black text-white mb-2">Switch Table?</h4>
                <p className="text-xs text-white/50 leading-relaxed max-w-[260px] mb-1">
                  You have an active order on{' '}
                  <span className="text-amber-300 font-bold">Table #{activeTable}</span>.
                </p>
                <p className="text-[11px] text-white/35 mb-7 max-w-[260px]">
                  Your order won't be cancelled. Continue to{' '}
                  <span className="text-white/60 font-semibold">Table #{confirmTargetTable}</span>?
                </p>

                <div className="flex gap-3 w-full max-w-[260px]">
                  <button
                    onClick={() => setConfirmTargetTable(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/6 border border-white/12 text-xs font-bold text-white/60 hover:bg-white/12 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSwitch}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
                  >
                    Switch →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TableSelectionModal;
