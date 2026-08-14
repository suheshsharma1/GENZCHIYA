import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, ChevronDown, ReceiptText, Crown, PackageSearch, Star, Trash2, Edit3, Send, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SVGLogo } from '../components/SVGLogo';
import { Review } from '../types';

const TEA_CATEGORIES = ['tea'];
const SNACK_CATEGORIES = ['cold-drinks'];

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
  served: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
  rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400',
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-brand-amber',
  accepted: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-brand-amber',
  preparing: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-brand-amber',
  ready: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-brand-amber animate-pulse',
};

const PAYMENT_LABELS: Record<string, string> = {
  khalti: 'Khalti',
  cash: 'Cash',
};

const REVIEW_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
  submitted: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
};

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, orderHistory, products, activeTable, currentSessionId, startNewSession, reviews, addReview, updateReview, deleteReview, clearOrderHistory } = useApp();
  const [activeTab, setActiveTab] = useState<'history' | 'reviews'>('history');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'tea' | 'snacks'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewSubmittingId, setReviewSubmittingId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);


  const combinedList = [...(orderHistory || []), ...(orders || [])];
  const uniqueMap = new Map<string, typeof combinedList[0]>();
  combinedList.forEach(o => {
    if (o && o.id && !uniqueMap.has(o.id)) {
      uniqueMap.set(o.id, o);
    }
  });

  const allCustomerOrders = Array.from(uniqueMap.values())
    .filter(order => {
      if (currentSessionId) {
        return order.sessionId === currentSessionId;
      }
      if (activeTable) {
        return order.tableNumber === activeTable;
      }
      return true;
    })
    .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime());

  const customerOrders = allCustomerOrders.filter(order => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'tea') return order.items.some(item => TEA_CATEGORIES.includes(item.product.category));
    if (historyFilter === 'snacks') return order.items.some(item => SNACK_CATEGORIES.includes(item.product.category));
    return true;
  });

  

  const getReviewForOrder = (orderId: string) => reviews.find(r => r.orderId === orderId);

  const handleReviewSubmit = (orderId: string, rating: number, comment: string) => {
    const order = allCustomerOrders.find(o => o.id === orderId);
    if (!order) return;
    addReview({
      orderId,
      tableNumber: order.tableNumber,
      sessionId: currentSessionId,
      rating,
      comment,
      status: 'submitted',
    });
    setReviewSubmittingId(null);
  };

  const handleReviewUpdate = (reviewId: string, rating: number, comment: string) => {
    updateReview(reviewId, { rating, comment });
    setEditingReviewId(null);
  };

  const handleReviewDelete = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
    }
  };

  const completedOrders = allCustomerOrders.filter(o => ['completed', 'served'].includes(o.status));
  const totalSpent = allCustomerOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 bg-brand-cream/90 dark:bg-brand-dark-bg/90 backdrop-blur-lg border-b border-brand-sage/10 dark:border-brand-dark-border/40 px-4 py-3 flex justify-between items-center max-w-xl mx-auto">
        <button 
          onClick={() => navigate(`/menu?table=${activeTable || '1'}`)}
          className="w-9 h-9 rounded-xl bg-white dark:bg-brand-dark-card shadow-sm border border-slate-100 dark:border-brand-dark-border/40 hover:shadow-md flex items-center justify-center text-brand-sage dark:text-brand-mint transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-black text-sm uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Customer Center</span>
        <div className="w-9" />
      </header>

      <main className="max-w-xl mx-auto px-4 mt-5 space-y-4">

        {/* ── Premium Profile Card ── */}
        <div className="relative overflow-hidden rounded-3xl shadow-lg border border-brand-sage/10 dark:border-brand-dark-border/40">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald via-brand-sage to-brand-emerald/80 dark:from-brand-dark-card dark:via-brand-dark-bg dark:to-brand-dark-card" />
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute top-4 right-16 w-20 h-20 rounded-full bg-white/8" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5" />

          <div className="relative p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar ring */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <UserCircle size={36} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-amber border-2 border-white flex items-center justify-center">
                  <Crown size={9} className="text-white" />
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-black text-base text-white leading-none">
                    {activeTable ? `Table #${activeTable}` : 'Table Guest'}
                  </h4>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-brand-amber/30 text-[9px] font-black text-brand-amber border border-brand-amber/20">
                    <Crown size={8} /> Gold
                  </span>
                </div>
                <p className="text-[11px] text-white/70 font-medium">Session #{activeTable || 'None'}</p>
                <p className="text-[11px] text-white/60 font-semibold mt-1">
                  {allCustomerOrders.length} orders · Rs. {totalSpent.toLocaleString()} spent
                </p>
              </div>
            </div>

            {activeTable && (
              <button
                onClick={() => {
                  startNewSession();
                  navigate('/');
                }}
                className="text-[10px] font-black px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/20 transition-all cursor-pointer shrink-0 backdrop-blur-sm"
                title="Clear table session for next guest"
              >
                New Session
              </button>
            )}
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex bg-white dark:bg-brand-dark-card rounded-2xl p-1.5 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 gap-1">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg shadow-md'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <ReceiptText size={13} />
            History ({customerOrders.length})
          {customerOrders.length > 0 && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); if (window.confirm('Clear all order history?')) clearOrderHistory(); }}
              className="ml-1 text-rose-400 hover:text-rose-600 cursor-pointer"
              title="Clear history"
            >
              <Trash2 size={11} />
            </span>
          )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg shadow-md'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <Star size={13} />
            Reviews ({reviews.filter(r => r.sessionId === currentSessionId || !currentSessionId).length})
          </button>
        </div>

        {/* ── Tab 1: Order History ── */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {/* Category Filter Chips */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: '🍵 All Orders' },
                { key: 'tea', label: '☕ Tea' },
                { key: 'snacks', label: '🍿 Snacks' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setHistoryFilter(key as 'all' | 'tea' | 'snacks')}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-black border transition-all cursor-pointer ${
                    historyFilter === key
                      ? 'bg-brand-emerald text-white border-brand-emerald shadow-md dark:bg-brand-amber dark:text-brand-dark-bg dark:border-brand-amber'
                      : 'bg-white dark:bg-brand-dark-card text-slate-500 dark:text-slate-400 border-slate-200 dark:border-brand-dark-border hover:border-brand-sage dark:hover:border-brand-amber'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {customerOrders.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-brand-dark-card rounded-3xl border border-dashed border-slate-200 dark:border-brand-dark-border/60 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-brand-emerald/8 dark:bg-brand-amber/10 mx-auto flex items-center justify-center mb-3">
                  <PackageSearch className="text-brand-emerald dark:text-brand-amber" size={28} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">No orders yet</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Your order history will appear here.</p>
              </div>
            ) : (
              customerOrders.map((order) => {
                const isExpanded = expandedId === order.id;
                const itemCustomTotal = (item: typeof order.items[number]) =>
                  (item.product.price + item.selectedCustomizations.reduce(
                    (cSum, cust) => cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
                  )) * item.quantity;
                const review = getReviewForOrder(order.id);

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 overflow-hidden transition-shadow hover:shadow-md"
                  >
                    {/* Collapsed row */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="p-4 flex justify-between items-center cursor-pointer"
                    >
                      <div className="text-left space-y-1.5 flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 font-mono truncate">#{order.id}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {review && (
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${REVIEW_STATUS_STYLES[review.status] || REVIEW_STATUS_STYLES.pending}`}>
                                {review.status === 'submitted' ? '⭐ Reviewed' : 'Pending'}
                              </span>
                            )}
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs font-bold leading-tight line-clamp-1 text-slate-700 dark:text-slate-200">
                          {order.items.map(item => `${item.product.name} ×${item.quantity}`).join(' · ')}
                        </div>

                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {new Date(order.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-sm font-black text-brand-emerald dark:text-brand-amber">
                            Rs. {order.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 ml-3 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-brand-dark-border/40 space-y-3">
                        {/* Meta grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'Order ID', value: order.id, mono: true },
                            { label: 'Table', value: `#${order.tableNumber}` },
                            { label: 'Payment', value: PAYMENT_LABELS[order.payment.method] || order.payment.method },
                            { label: 'Pay Status', value: order.payment.status, colored: true, status: order.payment.status },
                          ].map(({ label, value, mono, colored, status }) => (
                            <div key={label} className="bg-slate-50 dark:bg-brand-dark-bg/50 rounded-xl px-3 py-2">
                              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                              <p className={`text-[11px] font-bold truncate ${
                                mono ? 'font-mono text-slate-600 dark:text-slate-300' :
                                colored && status === 'success' ? 'text-emerald-600 dark:text-emerald-400 uppercase' :
                                colored && status === 'failed' ? 'text-rose-500 uppercase' :
                                colored ? 'text-amber-600 dark:text-brand-amber uppercase' :
                                'text-slate-700 dark:text-slate-200'
                              }`}>{value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-slate-50 dark:bg-brand-dark-bg/50 rounded-xl px-3 py-2">
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Date & Time</p>
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} · {new Date(order.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Items Ordered</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-brand-dark-bg/40 rounded-xl p-3 space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                                  {item.product.name} <span className="text-brand-emerald dark:text-brand-amber">×{item.quantity}</span>
                                </span>
                                <span className="text-[11px] font-extrabold text-brand-emerald dark:text-brand-amber whitespace-nowrap">
                                  Rs. {itemCustomTotal(item).toLocaleString()}
                                </span>
                              </div>
                              {item.selectedCustomizations.length > 0 && (
                                <div className="text-[9px] text-slate-400 italic">
                                  {item.selectedCustomizations.map((cust, cIdx) => (
                                    <div key={cIdx}>• {cust.name}: {cust.selections.map(s => `${s.name} (+Rs.${s.price})`).join(', ')}</div>
                                  ))}
                                </div>
                              )}
                              {item.notes && (
                                <div className="text-[9px] text-brand-amber font-semibold">Note: {item.notes}</div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Price breakdown */}
                        <div className="space-y-1.5 text-[11px] bg-slate-50 dark:bg-brand-dark-bg/40 rounded-xl px-3 py-3">
                          <div className="flex justify-between text-slate-400">
                            <span>Subtotal</span>
                            <span>Rs. {order.subtotal.toLocaleString()}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                              <span>Discount</span>
                              <span>-Rs. {order.discount.toLocaleString()}</span>
                            </div>
                          )}
                          {order.tax > 0 && (
                            <div className="flex justify-between text-slate-400">
                              <span>Tax (VAT)</span>
                              <span>Rs. {order.tax.toLocaleString()}</span>
                            </div>
                          )}
                          {order.serviceCharge > 0 && (
                            <div className="flex justify-between text-slate-400">
                              <span>Service Charge</span>
                              <span>Rs. {order.serviceCharge.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-extrabold border-t border-slate-200 dark:border-brand-dark-border/40 pt-2 text-brand-emerald dark:text-brand-amber text-xs">
                            <span>Grand Total</span>
                            <span>Rs. {order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Review Section for completed orders */}
                        {['completed', 'served'].includes(order.status) && (
                          <div className="border-t border-slate-100 dark:border-brand-dark-border/40 pt-3">
                            {review ? (
                              <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} size={14} fill={review.rating >= star ? '#f59e0b' : 'none'} className={review.rating >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'} />
                                    ))}
                                  </div>
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${REVIEW_STATUS_STYLES[review.status]}`}>
                                    {review.status}
                                  </span>
                                </div>
                                {review.comment && (
                                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
                                )}
                                {editingReviewId === review.id ? (
                                  <ReviewEditForm
                                    review={review}
                                    onSave={(rating, comment) => handleReviewUpdate(review.id, rating, comment)}
                                    onCancel={() => setEditingReviewId(null)}
                                  />
                                ) : (
                                  <div className="flex gap-2 pt-1">
                                    <button
                                      onClick={() => setEditingReviewId(review.id)}
                                      className="flex-1 bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                                    >
                                      <Edit3 size={10} /> Edit
                                    </button>
                                    <button
                                      onClick={() => handleReviewDelete(review.id)}
                                      className="flex-1 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                                    >
                                      <Trash2 size={10} /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : reviewSubmittingId === order.id ? (
                              <ReviewForm
                                onSubmit={(rating, comment) => handleReviewSubmit(order.id, rating, comment)}
                                onCancel={() => setReviewSubmittingId(null)}
                              />
                            ) : (
                              <button
                                onClick={() => setReviewSubmittingId(order.id)}
                                className="w-full bg-brand-emerald/10 dark:bg-brand-amber/15 hover:bg-brand-emerald/20 dark:hover:bg-brand-amber/25 text-brand-emerald dark:text-brand-amber font-black text-[11px] py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                              >
                                <Star size={13} />
                                Rate Your Experience
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Tab 2: Reviews ── */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Pending Reviews */}
            {completedOrders.filter(o => !getReviewForOrder(o.id)).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-left flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                  Pending Review
                </h4>
                {completedOrders.filter(o => !getReviewForOrder(o.id)).map(order => (
                  <div key={`pending-${order.id}`} className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-amber-200/60 dark:border-amber-900/30 overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="text-left space-y-1 flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 font-mono">#{order.id}</span>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${REVIEW_STATUS_STYLES.pending}`}>
                              Pending
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()} · Table #{order.tableNumber} · Rs. {order.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {reviewSubmittingId === order.id ? (
                        <div className="mt-3">
                          <ReviewForm
                            onSubmit={(rating, comment) => handleReviewSubmit(order.id, rating, comment)}
                            onCancel={() => setReviewSubmittingId(null)}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewSubmittingId(order.id)}
                          className="mt-3 w-full bg-brand-emerald hover:bg-brand-sage text-white text-[11px] font-black py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-brand-emerald/20"
                        >
                          <Star size={13} /> Rate This Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submitted Reviews */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-left flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Your Reviews
              </h4>
              {reviews.filter(r => !currentSessionId || r.sessionId === currentSessionId).length === 0 ? (
                <div className="text-center py-14 bg-white dark:bg-brand-dark-card rounded-3xl border border-dashed border-slate-200 dark:border-brand-dark-border/60 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-brand-amber/10 mx-auto flex items-center justify-center mb-3">
                    <Star className="text-brand-amber" size={24} />
                  </div>
                  <p className="text-slate-500 text-sm font-bold">No reviews yet</p>
                  <p className="text-slate-400 text-xs font-medium mt-1">Complete an order to share feedback!</p>
                </div>
              ) : (
                reviews.filter(r => !currentSessionId || r.sessionId === currentSessionId).map(review => (
                  <div key={review.id} className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 overflow-hidden">
                    {editingReviewId === review.id ? (
                      <div className="p-4 space-y-3">
                        <ReviewEditForm
                          review={review}
                          onSave={(rating, comment) => handleReviewUpdate(review.id, rating, comment)}
                          onCancel={() => setEditingReviewId(null)}
                        />
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={16} fill={review.rating >= star ? '#f59e0b' : 'none'} className={review.rating >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'} />
                              ))}
                            </div>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${REVIEW_STATUS_STYLES[review.status]}`}>
                              {review.status}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setEditingReviewId(review.id)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                              title="Edit review"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => handleReviewDelete(review.id)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500 transition-colors cursor-pointer"
                              title="Delete review"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div className="bg-slate-50 dark:bg-brand-dark-bg/50 rounded-xl px-2 py-1.5 text-center">
                            <p className="text-slate-400 text-[8px] font-bold uppercase">Order</p>
                            <p className="font-mono font-bold text-slate-600 dark:text-slate-300 truncate">{review.orderId}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-brand-dark-bg/50 rounded-xl px-2 py-1.5 text-center">
                            <p className="text-slate-400 text-[8px] font-bold uppercase">Table</p>
                            <p className="font-bold text-slate-600 dark:text-slate-300">#{review.tableNumber}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-brand-dark-bg/50 rounded-xl px-2 py-1.5 text-center">
                            <p className="text-slate-400 text-[8px] font-bold uppercase">Date</p>
                            <p className="font-bold text-slate-600 dark:text-slate-300">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {review.comment && (
                          <div className="bg-slate-50 dark:bg-brand-dark-bg/40 rounded-xl p-3">
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>
      
      {/* Footer Branding */}
      <div className="text-center py-8">
        <SVGLogo variant="icon" size={24} className="opacity-40 mx-auto" />
        <span className="block text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mt-1">GENZCHIYA Smart Lounge</span>
      </div>

    </div>
  );
};

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 transition-transform hover:scale-125 active:scale-95 cursor-pointer"
          >
            <Star 
              size={24} 
              fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'} 
              className={(hoverRating || rating) >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        className="w-full px-3 py-2.5 border-2 border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg rounded-xl outline-none text-xs font-semibold focus:border-brand-emerald dark:focus:border-brand-amber resize-none transition-colors dark:text-white"
        rows={2}
      />
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={rating === 0}
          className="flex-1 bg-brand-emerald hover:bg-brand-sage disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[10px] py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-brand-emerald/20"
        >
          <Send size={12} />
          Submit Review
        </button>
      </div>
    </form>
  );
};

interface ReviewEditFormProps {
  review: Review;
  onSave: (rating: number, comment: string) => void;
  onCancel: () => void;
}

const ReviewEditForm: React.FC<ReviewEditFormProps> = ({ review, onSave, onCancel }) => {
  const [rating, setRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review.comment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSave(rating, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 transition-transform hover:scale-125 active:scale-95 cursor-pointer"
          >
            <Star 
              size={24} 
              fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'} 
              className={(hoverRating || rating) >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        className="w-full px-3 py-2.5 border-2 border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg rounded-xl outline-none text-xs font-semibold focus:border-brand-emerald dark:focus:border-brand-amber resize-none transition-colors dark:text-white"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={rating === 0}
          className="flex-1 bg-brand-emerald hover:bg-brand-sage disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[10px] py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-brand-emerald/20"
        >
          <Send size={12} />
          Update Review
        </button>
      </div>
    </form>
  );
};

export default HistoryPage;
