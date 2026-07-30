import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Eye, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface TableCardProps {
  tableNumber: string;
  status: 'available' | 'occupied';
  orderId?: string | null;
  occupiedAt?: string | null;
  order?: Order | null;
  canFree?: boolean;
  onSelect?: () => void;
  onViewOrder?: () => void;
  onFreeTable?: () => void;
  compact?: boolean;
}

const TableCard: React.FC<TableCardProps> = ({
  tableNumber,
  status,
  orderId,
  occupiedAt,
  order,
  canFree = true,
  onSelect,
  onViewOrder,
  onFreeTable,
  compact = false,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const isOccupied = status === 'occupied';

  const formatOccupiedTime = (iso: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFree = () => {
    if (onFreeTable) {
      onFreeTable();
    }
    setShowConfirm(false);
  };

  if (compact) {
    return (
      <div className="relative">
        <div
          className={`
            rounded-2xl border-2 p-4 text-center transition-all duration-200
            ${isOccupied
              ? 'bg-slate-100 dark:bg-brand-dark-bg border-slate-200 dark:border-brand-dark-border cursor-not-allowed opacity-70'
              : 'bg-white dark:bg-brand-dark-card border-red-400/50 dark:border-red-500/40 hover:border-red-500 hover:shadow-md cursor-pointer'
            }
          `}
          onClick={() => {
            if (!isOccupied && onSelect) onSelect();
          }}
        >
          {isOccupied && (
            <div className="absolute top-2 right-2">
              <Lock size={14} className="text-slate-400" />
            </div>
          )}
          <span className="text-lg font-black text-slate-800 dark:text-white font-brand-serif">
            #{tableNumber}
          </span>
          <p className="text-[10px] font-bold mt-1 uppercase tracking-wider">
            {isOccupied ? (
              <span className="text-red-500">Occupied</span>
            ) : (
              <span className="text-emerald-500">Available</span>
            )}
          </p>
          {isOccupied && (
            <p className="text-[9px] text-slate-400 mt-1">This table is currently occupied.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        layout
        className={`
          rounded-2xl border-2 p-5 text-left transition-all duration-200
          ${isOccupied
            ? 'bg-slate-100 dark:bg-brand-dark-card border-slate-200 dark:border-brand-dark-border'
            : 'bg-white dark:bg-brand-dark-card border-red-400/40 dark:border-red-500/30 hover:border-red-500 hover:shadow-lg hover:-translate-y-0.5'
          }
        `}
      >
        {isOccupied && (
          <div className="absolute top-3 right-3">
            <Lock size={16} className="text-slate-400" />
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-black text-slate-800 dark:text-white font-brand-serif">
            #{tableNumber}
          </span>
          <span
            className={`
              text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full
              ${isOccupied
                ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                : 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
              }
            `}
          >
            {isOccupied ? 'Occupied' : 'Available'}
          </span>
        </div>

        {isOccupied && (orderId || occupiedAt) && (
          <div className="space-y-2 mb-4 p-3 bg-slate-50 dark:bg-brand-dark-bg rounded-xl">
            {orderId && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-bold">Order:</span> {orderId}
              </p>
            )}
            {occupiedAt && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-bold">Occupied:</span> {formatOccupiedTime(occupiedAt)}
              </p>
            )}
          </div>
        )}

        {isOccupied && order && (
          <div className="space-y-2 mb-4 p-3 bg-slate-50 dark:bg-brand-dark-bg rounded-xl">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold">Status:</span>{' '}
              <span className={`font-extrabold uppercase ${
                order.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {order.status}
              </span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold">Total:</span> Rs. {order.total.toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {!isOccupied ? (
            onSelect && (
              <button
                onClick={onSelect}
                className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Select Table
              </button>
            )
          ) : (
            <>
              {onViewOrder && order && (
                <button
                  onClick={onViewOrder}
                  className="flex-1 bg-slate-200 dark:bg-brand-dark-bg hover:bg-slate-300 dark:hover:bg-brand-dark-border text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Eye size={12} />
                  View Order
                </button>
              )}
              {onFreeTable && (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={!canFree}
                  className={`
                    flex-1 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer
                    flex items-center justify-center gap-1
                    ${canFree
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-brand-dark-bg text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }
                  `}
                  title={canFree ? 'Free this table' : 'Order must be completed before freeing'}
                >
                  <Unlock size={12} />
                  Free Table
                </button>
              )}
            </>
          )}
        </div>

        {/* Confirmation Modal inline */}
        {showConfirm && onFreeTable && (
          <div className="mt-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Are you sure you want to free this table?
              </p>
            </div>
            <p className="text-[10px] text-slate-400">
              Table <span className="font-bold">#{tableNumber}</span> will become available for new customers.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-brand-dark-border text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-dark-bg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFree}
                className="flex-1 py-2 px-3 rounded-xl bg-brand-emerald hover:bg-brand-sage text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Free Table
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export { TableCard };