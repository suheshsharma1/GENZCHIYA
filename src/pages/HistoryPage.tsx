import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, ChevronDown, ReceiptText, Crown, PackageSearch, Star, Trash2, Edit3, Send } from 'lucide-react';
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
  const { orders, orderHistory, products, activeTable, currentSessionId, startNewSession, reviews, addReview, updateReview, deleteReview } = useApp();
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

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-cream/80 dark:bg-brand-dark-bg/85 backdrop-blur-md border-b border-brand-sage/5 dark:border-brand-dark-border/40 px-4 py-3 flex justify-between items-center max-w-xl mx-auto">
        <button 
          onClick={() => navigate(`/menu?table=${activeTable || '1'}`)}
          className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-brand-sage dark:text-brand-mint cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-200">Customer Center</span>
        <div className="w-10" />
      </header>

      <main className="max-w-xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-emerald/10 dark:bg-brand-amber/15 text-brand-emerald dark:text-brand-amber flex items-center justify-center shrink-0">
              <UserCircle size={30} />
            </div>
            <div className="text-left space-y-1">
              <h4 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>{activeTable ? `Table #${activeTable}` : 'Table Guest'}</span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-brand-amber/20 text-[9px] font-bold text-brand-amber border border-brand-amber/10">
                  <Crown size={10} />
                  Gold Tier
                </span>
              </h4>
              <p className="text-xs text-slate-400 font-medium">Table Session: #{activeTable || 'None'}</p>
            </div>
          </div>

          {activeTable && (
            <button
              onClick={() => {
                startNewSession();
                navigate('/');
              }}
              className="text-[10px] font-extrabold px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer shrink-0"
              title="Clear table session for next guest"
            >
              New Session
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-brand-dark-card rounded-xl p-1 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <ReceiptText size={13} />
            History ({customerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Star size={13} />
            Reviews ({reviews.filter(r => r.sessionId === currentSessionId || !currentSessionId).length})
          </button>
          {/* Favorites tab removed */}
        </div>

        {/* Tab 1: Order History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {/* Category Filter Chips */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'tea', label: 'Tea Only' },
                { key: 'snacks', label: 'Snacks Only' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setHistoryFilter(key as 'all' | 'tea' | 'snacks')}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                    historyFilter === key
                      ? 'bg-brand-emerald text-white border-brand-emerald dark:bg-brand-amber dark:text-brand-dark-bg dark:border-brand-amber'
                      : 'bg-white dark:bg-brand-dark-card text-slate-500 dark:text-slate-400 border-slate-200 dark:border-brand-dark-border hover:border-brand-sage dark:hover:border-brand-amber'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {customerOrders.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-brand-dark-border/60">
                <PackageSearch className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                <p className="text-slate-400 text-xs font-medium">No order history recorded yet.</p>
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
                    className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 overflow-hidden"
                  >
                    {/* Collapsed row (click to expand) */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="p-4 flex justify-between items-center hover:shadow-md cursor-pointer transition-shadow"
                    >
                      <div className="text-left space-y-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 font-mono">Invoice: {order.id}</span>
                          <div className="flex items-center gap-1.5">
                            {review && (
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${REVIEW_STATUS_STYLES[review.status] || REVIEW_STATUS_STYLES.pending}`}>
                                {review.status === 'submitted' ? 'Reviewed' : 'Pending Review'}
                              </span>
                            )}
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs font-bold leading-tight line-clamp-1">
                          {order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-xs font-extrabold text-brand-emerald dark:text-brand-amber">
                            Rs. {order.total}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 ml-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-brand-dark-border/40 space-y-3">
                        {/* Meta grid */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Order ID</span>
                            <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{order.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Table</span>
                            <span className="font-bold text-slate-600 dark:text-slate-300">#{order.tableNumber}</span>
                          </div>
                          <div className="flex justify-between col-span-2">
                            <span className="text-slate-400">Date & Time</span>
                            <span className="font-bold text-slate-600 dark:text-slate-300">
                              {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} · {new Date(order.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Payment</span>
                            <span className="font-bold text-slate-600 dark:text-slate-300">{PAYMENT_LABELS[order.payment.method] || order.payment.method}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Pay Status</span>
                            <span className={`font-bold uppercase ${order.payment.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : order.payment.status === 'failed' ? 'text-rose-500' : 'text-amber-600 dark:text-brand-amber'}`}>
                              {order.payment.status}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-brand-dark-bg/40 rounded-xl p-2.5 space-y-1">
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
                        <div className="space-y-1 text-[11px] border-t border-slate-100 dark:border-brand-dark-border/40 pt-2">
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
                          <div className="flex justify-between font-extrabold border-t border-slate-200 dark:border-brand-dark-border/40 pt-1.5 text-brand-emerald dark:text-brand-amber">
                            <span>Grand Total</span>
                            <span>Rs. {order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Review Section for completed orders */}
                        {['completed', 'served'].includes(order.status) && (
                          <div className="border-t border-slate-100 dark:border-brand-dark-border/40 pt-3">
                            {review ? (
                              <div className="bg-slate-50 dark:bg-brand-dark-bg/60 rounded-xl p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} size={14} fill={review.rating >= star ? '#f59e0b' : 'none'} className={review.rating >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'} />
                                    ))}
                                  </div>
                                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${REVIEW_STATUS_STYLES[review.status]}`}>
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
                                      className="flex-1 bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                                    >
                                      <Edit3 size={10} /> Edit
                                    </button>
                                    <button
                                      onClick={() => handleReviewDelete(review.id)}
                                      className="flex-1 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
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
                                className="w-full bg-brand-emerald/10 dark:bg-brand-amber/15 hover:bg-brand-emerald/20 dark:hover:bg-brand-amber/25 text-brand-emerald dark:text-brand-amber font-bold text-[11px] py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                              >
                                <Star size={14} />
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

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Pending Reviews */}
            {completedOrders.filter(o => !getReviewForOrder(o.id)).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 text-left">Pending Review</h4>
                {completedOrders.filter(o => !getReviewForOrder(o.id)).map(order => (
                  <div key={`pending-${order.id}`} className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 overflow-hidden">
                    <div className="p-4 flex justify-between items-center">
                      <div className="text-left space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 font-mono">Invoice: {order.id}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${REVIEW_STATUS_STYLES.pending}`}>
                            Pending Review
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()} · Table #{order.tableNumber} · Rs. {order.total}
                        </p>
                      </div>
                      {reviewSubmittingId === order.id ? (
                        <ReviewForm
                          onSubmit={(rating, comment) => handleReviewSubmit(order.id, rating, comment)}
                          onCancel={() => setReviewSubmittingId(null)}
                        />
                      ) : (
                        <button
                          onClick={() => setReviewSubmittingId(order.id)}
                          className="bg-brand-emerald hover:bg-brand-sage text-white text-[10px] font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Star size={12} /> Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submitted Reviews */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 text-left">Your Reviews</h4>
              {                  reviews.filter(r => !currentSessionId || r.sessionId === currentSessionId).length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-brand-dark-border/60">
                  <Star className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={28} />
                  <p className="text-slate-400 text-xs font-medium">No reviews yet. Complete an order to share your feedback!</p>
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
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${REVIEW_STATUS_STYLES[review.status]}`}>
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
                         <div className="text-[10px] text-slate-400 space-y-0.5">
                           <p>Order: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{review.orderId}</span></p>
                           <p>Table: <span className="font-bold text-slate-600 dark:text-slate-300">#{review.tableNumber}</span></p>
                           <p>Date: <span className="font-bold text-slate-600 dark:text-slate-300">{new Date(review.createdAt).toLocaleDateString()}</span></p>
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

        {/* Favorites section removed */}

      </main>
      
      {/* Footer Branding */}
      <div className="text-center py-6">
        <SVGLogo variant="icon" size={24} className="opacity-45" />
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
      <div className="flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Star 
              size={22} 
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
        className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl outline-none text-xs font-semibold focus:border-brand-sage resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold py-2 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={rating === 0}
          className="flex-1 bg-brand-emerald hover:bg-brand-sage disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
      <div className="flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Star 
              size={22} 
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
        className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl outline-none text-xs font-semibold focus:border-brand-sage resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold py-2 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={rating === 0}
          className="flex-1 bg-brand-emerald hover:bg-brand-sage disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Send size={12} />
          Update Review
        </button>
      </div>
    </form>
  );
};

export default HistoryPage;
