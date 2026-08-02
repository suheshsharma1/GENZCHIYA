import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, Timer, CheckCircle2, Clock, Flame, Coffee, 
  Layers, AlertCircle, Check, X, RefreshCw, LogOut, ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { SVGLogo } from '../components/SVGLogo';

export const KitchenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, logoutStaff } = useApp();

  // Kitchen filter state: 'all' | 'preparing' | 'ready'
  const [kitchenFilter, setKitchenFilter] = useState<'all' | 'preparing' | 'ready'>('all');

  // Checked items state per order: { orderId-itemIndex: boolean }
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});



  // Filter kitchen orders (pending, preparing, ready)
  const kitchenOrders = useMemo(() => {
    return orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  }, [orders]);

  const filteredKitchenOrders = useMemo(() => {
    if (kitchenFilter === 'all') return kitchenOrders;
    if (kitchenFilter === 'preparing') return kitchenOrders.filter(o => o.status === 'pending' || o.status === 'preparing');
    return kitchenOrders.filter(o => o.status === 'ready');
  }, [kitchenOrders, kitchenFilter]);

  // Stat metrics
  const kitchenStats = useMemo(() => {
    const activePrep = kitchenOrders.filter(o => o.status === 'preparing' || o.status === 'pending').length;
    const readyServing = kitchenOrders.filter(o => o.status === 'ready').length;
    const totalItemsCount = kitchenOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

    // Batch Cooking breakdown
    const batchMap: Record<string, number> = {};
    kitchenOrders.forEach(o => {
      if (o.status === 'pending' || o.status === 'preparing') {
        o.items.forEach(i => {
          batchMap[i.product.name] = (batchMap[i.product.name] || 0) + i.quantity;
        });
      }
    });

    return {
      activePrep,
      readyServing,
      totalItemsCount,
      batchBreakdown: Object.entries(batchMap).sort((a, b) => b[1] - a[1]),
    };
  }, [kitchenOrders]);



  const toggleItemCheck = (orderId: string, itemIdx: number) => {
    const key = `${orderId}-${itemIdx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg text-slate-800 dark:text-slate-100 flex flex-col selection:bg-brand-emerald selection:text-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md border-b border-slate-200/80 dark:border-brand-dark-border px-6 py-3 shadow-sm">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <SVGLogo size={36} />
            <div>
              <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                GENZCHIYA
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:bg-brand-amber/20 dark:text-brand-amber border border-amber-500/20 dark:border-brand-amber/30 flex items-center gap-1">
                  <ChefHat size={12} />
                  Kitchen Display
                </span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Kitchen Preparation System
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-brand-dark-bg p-1.5 rounded-2xl border border-slate-200 dark:border-brand-dark-border">
            <button
              onClick={() => navigate('/admin/cashier')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10"
            >
              <span>💰</span>
              <span>Cashier Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/admin/kitchen')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer bg-amber-500 text-white shadow-md"
            >
              <span>👨‍🍳</span>
              <span>Kitchen Dashboard</span>
            </button>
          </div>

          {/* Exit Portal Button */}
          <button
            onClick={() => { logoutStaff(); navigate('/'); }}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Exit Portal</span>
          </button>
        </div>
      </header>

      {/* ── Main Full-Width Kitchen Interface ── */}
      <main className="flex-1 w-full p-6 space-y-6 max-w-7xl mx-auto">


        {/* Kitchen Metric Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-brand-dark-card border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Prep</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{kitchenStats.activePrep}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <Timer size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark-card border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ready Serving</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{kitchenStats.readyServing}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark-card border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Items</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kitchenStats.totalItemsCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Coffee size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark-card border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Batch Cooking</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{kitchenStats.batchBreakdown.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <Layers size={20} />
            </div>
          </div>
        </div>

        {/* Filter & Queue Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-slate-200/80 dark:border-brand-dark-border shadow-sm">
          <div className="flex items-center gap-2">
            <ChefHat size={18} className="text-amber-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Kitchen Order Queue ({filteredKitchenOrders.length})
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-brand-dark-bg p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'preparing', label: 'Preparing' },
              { id: 'ready', label: 'Ready' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setKitchenFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  kitchenFilter === f.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Cooking Breakdown */}
        {kitchenStats.batchBreakdown.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <Flame size={14} />
              <span>Batch Preparation Summary (Active Items Needed Now)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {kitchenStats.batchBreakdown.map(([itemName, count]) => (
                <div key={itemName} className="bg-white dark:bg-brand-dark-card px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-sm flex items-center gap-2 text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{itemName}</span>
                  <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kitchen Ticket Cards Grid */}
        {filteredKitchenOrders.length === 0 ? (
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl border border-slate-200/80 dark:border-brand-dark-border p-16 text-center text-slate-400 space-y-3 shadow-sm">
            <ChefHat size={48} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-base font-bold">No active tickets in the kitchen.</p>
            <p className="text-xs">Waiting for new orders to arrive...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKitchenOrders.map(order => {
              const elapsedMins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
              const isUrgent = elapsedMins >= 15;

              return (
                <div
                  key={order.id}
                  className={`bg-white dark:bg-brand-dark-card rounded-3xl border-2 p-5 space-y-4 shadow-md relative flex flex-col justify-between transition-all ${
                    order.status === 'ready'
                      ? 'border-emerald-500/60 bg-emerald-50/10'
                      : isUrgent
                        ? 'border-rose-500/80 bg-rose-50/10'
                        : 'border-amber-500/60 bg-amber-50/10'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-200/80 dark:border-brand-dark-border pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">
                            Table #{order.tableNumber}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{order.id.slice(-4)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'ready'
                            ? 'bg-emerald-500 text-white'
                            : order.status === 'preparing'
                              ? 'bg-amber-500 text-white'
                              : 'bg-rose-500 text-white'
                        }`}>
                          {order.status}
                        </span>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${
                          isUrgent ? 'text-rose-600 font-black animate-pulse' : 'text-slate-400'
                        }`}>
                          <Clock size={10} />
                          {elapsedMins}m ago
                        </span>
                      </div>
                    </div>

                    {/* Preparation Items Checklist */}
                    <div className="space-y-2 py-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Order Items Checklist:
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => {
                          const itemKey = `${order.id}-${idx}`;
                          const isDone = !!checkedItems[itemKey];

                          return (
                            <div
                              key={idx}
                              onClick={() => toggleItemCheck(order.id, idx)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                isDone
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 line-through opacity-60'
                                  : 'bg-slate-50 dark:bg-brand-dark-bg/80 border-slate-200/80 dark:border-brand-dark-border text-slate-900 dark:text-white hover:border-amber-500'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                  isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                                }`}>
                                  {isDone && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span className="text-sm font-extrabold">
                                  {item.quantity}x {item.product.name}
                                </span>
                              </div>

                              {item.notes && (
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md">
                                  {item.notes}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="pt-3 border-t border-slate-200/80 dark:border-brand-dark-border space-y-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing', { estTime: 15 })}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Flame size={16} />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        <span>Mark Order Ready</span>
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'served')}
                        className="w-full bg-slate-900 dark:bg-brand-amber hover:bg-slate-800 text-white dark:text-brand-dark-bg font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Check size={16} />
                        <span>Mark Served &amp; Complete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default KitchenDashboard;
