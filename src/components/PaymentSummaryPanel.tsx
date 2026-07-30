import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Order } from '../types';
import { Wallet, CreditCard, Receipt, Filter, ChevronDown, TrendingUp, Trash2 } from 'lucide-react';

interface PaymentSummaryPanelProps {
  orders: Order[];
  orderHistory: Order[];
  onClearHistory?: () => void;
}

type PaymentFilter = 'all' | 'cash' | 'khalti';
type DateFilter = 'all' | 'today' | 'week' | 'month';

export const PaymentSummaryPanel: React.FC<PaymentSummaryPanelProps> = ({ orders, orderHistory, onClearHistory }) => {
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all payment history? This action cannot be undone.')) {
      onClearHistory?.();
    }
  };

  const filteredOrders = useMemo(() => {
    const allOrders = [...orders, ...orderHistory];
    let filtered = allOrders;

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(o => o.payment.method === paymentFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        if (dateFilter === 'today') {
          return orderDate >= today;
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        }
        return true;
      });
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, orderHistory, paymentFilter, dateFilter]);

  const summary = useMemo(() => {
    const cashOrders = filteredOrders.filter(o => o.payment.method === 'cash');
    const onlineOrders = filteredOrders.filter(o => o.payment.method === 'khalti');
    const khaltiOrders = filteredOrders.filter(o => o.payment.method === 'khalti');

    const cashTotal = cashOrders.reduce((sum, o) => sum + o.total, 0);
    const onlineTotal = onlineOrders.reduce((sum, o) => sum + o.total, 0);
    const khaltiTotal = khaltiOrders.reduce((sum, o) => sum + o.total, 0);
    const grandTotal = cashTotal + onlineTotal;

    return {
      cashOrders,
      onlineOrders,
      khaltiOrders,
      cashTotal,
      onlineTotal,
      khaltiTotal,
      grandTotal,
      totalOrders: filteredOrders.length
    };
  }, [filteredOrders]);

  const formatRs = (amount: number) => `Rs. ${amount.toLocaleString()}`;

  const getPaymentBadge = (method: string, status: string) => {
    const baseClasses = 'text-[8px] font-bold uppercase px-1.5 py-0.5 rounded';
    if (method === 'cash') {
      return status === 'success'
        ? `${baseClasses} bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400`
        : `${baseClasses} bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400`;
    }
    if (method === 'khalti') {
      return status === 'success'
        ? `${baseClasses} bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400`
        : `${baseClasses} bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400`;
    }
    return baseClasses;
  };

  const getPaymentIcon = (method: string) => {
    if (method === 'cash') return <Wallet size={12} className="text-emerald-500 dark:text-emerald-400 shrink-0" />;
    if (method === 'khalti') return <CreditCard size={12} className="text-purple-500 dark:text-purple-400 shrink-0" />;
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-brand-dark-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-emerald/10 dark:bg-brand-amber/15 text-brand-emerald dark:text-brand-amber flex items-center justify-center">
                <Receipt size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white">Payment Summary</h3>
                <p className="text-[10px] text-slate-400">{summary.totalOrders} orders found</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Clear History</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
              >
                <Filter size={12} />
                <span>Filters</span>
                <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 dark:border-brand-dark-border/30"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Payment Method</label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-brand-emerald dark:focus:border-brand-amber"
                  >
                    <option value="all">All Payments</option>
                    <option value="cash">Cash</option>
                    <option value="khalti">Khalti</option>
                    </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-brand-emerald dark:focus:border-brand-amber"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Payment Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cash Payments */}
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-brand-dark-border/30">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Wallet size={12} />
                </span>
                Cash Payments
              </h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-brand-dark-bg px-2 py-0.5 rounded-full">
                {summary.cashOrders.length} orders
              </span>
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex-1 bg-slate-50 dark:bg-brand-dark-bg rounded-xl p-2.5 text-center">
                <p className="text-lg font-black text-brand-emerald dark:text-brand-amber">{formatRs(summary.cashTotal)}</p>
                <p className="text-[9px] text-slate-400 uppercase font-semibold mt-0.5">Total Cash</p>
              </div>
            </div>
          </div>
          <div className="max-h-[35vh] overflow-y-auto p-2 scrollbar-thin">
            {summary.cashOrders.length === 0 ? (
              <div className="text-center py-8">
                <Wallet size={24} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 font-semibold">No cash payments found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {summary.cashOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-brand-dark-border/30">
                     <div className="min-w-0 flex-1">
                       <div className="flex items-center gap-1.5 mb-0.5">
                         {getPaymentIcon(order.payment.method)}
                         <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">
                           Table #{order.tableNumber}
                         </p>
                       </div>
                       <p className="text-[9px] text-slate-400">
                         #{order.id} · {new Date(order.createdAt).toLocaleDateString()} · {order.items.map(i => i.product.name).join(', ')}
                       </p>
                     </div>
                     <div className="text-right ml-2">
                       <p className="text-[10px] font-black text-brand-emerald dark:text-brand-amber">{formatRs(order.total)}</p>
                       <span className={getPaymentBadge(order.payment.method, order.payment.status)}>
                         {order.payment.status}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </div>

         {/* Online Payments */}
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-brand-dark-border/30">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-400/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <CreditCard size={12} />
                </span>
                Online Payments
              </h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-brand-dark-bg px-2 py-0.5 rounded-full">
                {summary.onlineOrders.length} orders
              </span>
            </div>
            <div className="mt-3">
              <div className="bg-slate-50 dark:bg-brand-dark-bg rounded-xl p-2.5 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Khalti</p>
                <p className="text-sm font-black text-purple-600 dark:text-purple-400">{formatRs(summary.khaltiTotal)}</p>
                <p className="text-[9px] text-slate-400">{summary.khaltiOrders.length} orders</p>
              </div>
            </div>
          </div>
          <div className="max-h-[35vh] overflow-y-auto p-2 scrollbar-thin">
            {summary.onlineOrders.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard size={24} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 font-semibold">No online payments found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {summary.onlineOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-brand-dark-border/30">
                     <div className="min-w-0 flex-1">
                       <div className="flex items-center gap-1.5 mb-0.5">
                         {getPaymentIcon(order.payment.method)}
                         <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">
                           Table #{order.tableNumber}
                         </p>
                       </div>
                       <p className="text-[9px] text-slate-400">
                         #{order.id} · {new Date(order.createdAt).toLocaleDateString()} · {order.items.map(i => i.product.name).join(', ')}
                       </p>
                     </div>
                     <div className="text-right ml-2">
                      <p className="text-[10px] font-black text-brand-emerald dark:text-brand-amber">{formatRs(order.total)}</p>
                      <span className={getPaymentBadge(order.payment.method, order.payment.status)}>
                        {order.payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-r from-brand-emerald to-brand-sage dark:from-brand-amber dark:to-brand-gold rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Total Summary</h3>
                <p className="text-[10px] text-white/80 font-medium">Combined revenue from all payment methods</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">{formatRs(summary.grandTotal)}</p>
              <p className="text-[10px] text-white/80 font-semibold">{summary.totalOrders} total orders</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-[10px] text-white/80 uppercase font-semibold mb-1">Cash</p>
              <p className="text-base font-black text-white">{formatRs(summary.cashTotal)}</p>
              <p className="text-[9px] text-white/70">{summary.cashOrders.length} orders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-[10px] text-white/80 uppercase font-semibold mb-1">Online</p>
              <p className="text-base font-black text-white">{formatRs(summary.onlineTotal)}</p>
              <p className="text-[9px] text-white/70">{summary.onlineOrders.length} orders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-[10px] text-white/80 uppercase font-semibold mb-1">Grand Total</p>
              <p className="text-base font-black text-white">{formatRs(summary.grandTotal)}</p>
              <p className="text-[9px] text-white/70">All payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryPanel;