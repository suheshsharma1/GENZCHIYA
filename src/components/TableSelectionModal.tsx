import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TableSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate table numbers 1 to 50
const ALL_TABLES = Array.from({ length: 50 }, (_, i) => String(i + 1));

// Reserved tables list (can be customized)
const RESERVED_TABLES = new Set(['13', '25', '40']);

export const TableSelectionModal: React.FC<TableSelectionModalProps> = ({ isOpen, onClose }) => {
  const { activeTable, switchTable, orders, currentOrderId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmTargetTable, setConfirmTargetTable] = useState<string | null>(null);

  // Determine tables that currently have active (non-completed, non-served, non-rejected) orders
  const occupiedTables = useMemo(() => {
    const activeSet = new Set<string>();
    orders.forEach(o => {
      if (o.status !== 'served' && o.status !== 'completed' && o.status !== 'rejected') {
        if (o.tableNumber) {
          activeSet.add(o.tableNumber);
        }
      }
    });
    return activeSet;
  }, [orders]);

  // Check if currently selected activeTable has an active order
  const currentTableHasActiveOrder = useMemo(() => {
    if (!activeTable) return false;
    if (currentOrderId) {
      const activeOrder = orders.find(o => o.id === currentOrderId);
      if (activeOrder && !['served', 'completed', 'rejected'].includes(activeOrder.status)) {
        return true;
      }
    }
    return occupiedTables.has(activeTable);
  }, [activeTable, currentOrderId, orders, occupiedTables]);

  // Filter tables by search query
  const filteredTables = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return ALL_TABLES;
    return ALL_TABLES.filter(t => t.includes(query) || `table ${t}`.toLowerCase().includes(query.toLowerCase()));
  }, [searchQuery]);

  const handleTableClick = (tableNum: string) => {
    if (tableNum === activeTable) {
      onClose();
      return;
    }

    if (RESERVED_TABLES.has(tableNum)) {
      return; // Reserved table cannot be selected
    }

    // If current table has an active order, prompt confirmation dialog
    if (currentTableHasActiveOrder) {
      setConfirmTargetTable(tableNum);
    } else {
      switchTable(tableNum);
      onClose();
    }
  };

  const handleConfirmSwitch = () => {
    if (confirmTargetTable) {
      switchTable(confirmTargetTable);
      setConfirmTargetTable(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Main Dialog Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-brand-cream dark:bg-brand-dark-card border border-brand-sage/10 dark:border-brand-dark-border rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 bg-white/60 dark:bg-brand-dark-bg/60 border-b border-slate-100 dark:border-brand-dark-border/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-emerald/10 dark:bg-brand-amber/15 text-brand-emerald dark:text-brand-amber rounded-2xl">
                <UtensilsCrossed size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white font-brand-serif">
                  Select Table
                </h3>
                <p className="text-xs text-slate-400">
                  {activeTable ? (
                    <>Current Active Table: <span className="font-extrabold text-brand-emerald dark:text-brand-amber">#{activeTable}</span></>
                  ) : (
                    'Choose a table for your dining session'
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Box & Legend */}
          <div className="p-5 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search table number (e.g. 12)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-brand-dark-bg border border-slate-200 dark:border-brand-dark-border focus:border-brand-emerald dark:focus:border-brand-amber outline-none text-xs font-medium dark:text-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Legend Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm animate-pulse" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm" />
                <span>Reserved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald dark:bg-brand-amber inline-block ring-2 ring-brand-emerald/30 dark:ring-brand-amber/30" />
                <span>Current</span>
              </div>
            </div>

            {/* Table Grid */}
            <div className="max-h-[300px] overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {filteredTables.map((tNum) => {
                const isCurrent = tNum === activeTable;
                const isOccupied = occupiedTables.has(tNum);
                const isReserved = RESERVED_TABLES.has(tNum);

                let badgeStyle = 'bg-white dark:bg-brand-dark-bg border-slate-200 dark:border-brand-dark-border text-slate-700 dark:text-slate-200 hover:border-brand-emerald hover:shadow-sm';
                let statusLabel = 'Available';
                let dotColor = 'bg-emerald-500';

                if (isCurrent) {
                  badgeStyle = 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg border-brand-emerald dark:border-brand-amber shadow-md ring-2 ring-brand-emerald/40 dark:ring-brand-amber/40 font-black';
                  statusLabel = 'Current';
                  dotColor = 'bg-white dark:bg-brand-dark-bg';
                } else if (isReserved) {
                  badgeStyle = 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-400 dark:text-rose-500 cursor-not-allowed opacity-60';
                  statusLabel = 'Reserved';
                  dotColor = 'bg-rose-500';
                } else if (isOccupied) {
                  badgeStyle = 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 hover:border-amber-400';
                  statusLabel = 'Occupied';
                  dotColor = 'bg-amber-500';
                }

                return (
                  <button
                    key={tNum}
                    onClick={() => handleTableClick(tNum)}
                    disabled={isReserved}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group ${badgeStyle}`}
                  >
                    {/* Status Dot */}
                    <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${dotColor}`} />

                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                      Table
                    </span>
                    <span className="text-lg font-black leading-none mt-0.5">
                      #{tNum}
                    </span>
                    <span className="text-[8px] font-semibold tracking-wide uppercase mt-1 opacity-80">
                      {statusLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-white/40 dark:bg-brand-dark-bg/40 border-t border-slate-100 dark:border-brand-dark-border/40 text-center text-[10px] text-slate-400">
            💡 Selecting a table sets your active session for ordering.
          </div>

          {/* Confirmation Overlay (Prompted when switching from a table with an active order) */}
          <AnimatePresence>
            {confirmTargetTable && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-20 bg-white/95 dark:bg-brand-dark-card/95 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <AlertTriangle size={30} />
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <h4 className="text-base font-black text-slate-800 dark:text-white font-brand-serif">
                    Active Order Notice
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                    You currently have an active order on <span className="font-extrabold text-brand-emerald dark:text-brand-amber">Table #{activeTable}</span>.
                  </p>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Switching tables will not cancel your previous order. Do you want to continue to <span className="font-bold text-slate-700 dark:text-slate-200">Table #{confirmTargetTable}</span>?
                  </p>
                </div>

                <div className="flex gap-3 w-full max-w-xs pt-2">
                  <button
                    onClick={() => setConfirmTargetTable(null)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-brand-dark-border text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-dark-bg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSwitch}
                    className="flex-1 py-3 px-4 rounded-xl bg-brand-emerald dark:bg-brand-amber text-white dark:text-brand-dark-bg text-xs font-extrabold shadow-lg hover:opacity-90 transition-all cursor-pointer"
                  >
                    Switch Table
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
