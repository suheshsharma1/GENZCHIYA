import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, MapPin, Receipt, Star, ArrowLeft, HeartHandshake, CheckCircle2, 
  Loader2, AlertCircle, Sparkles, Smile, MessageSquare, Download,
  UtensilsCrossed, ChefHat, Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReceiptPDF } from '../components/ReceiptPDF';
import { downloadReceiptPDF } from '../utils/pdf';
import { SVGLogo } from '../components/SVGLogo';

export const OrderTrackingPage: React.FC = () => {
  const { orderId: routeOrderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, orderHistory, currentOrderId, activeTable, updateOrderStatus } = useApp();

  const targetId = routeOrderId || currentOrderId;

  const order = useMemo(() => {
    if (targetId) {
      const match = orders.find(o => o.id === targetId) || orderHistory.find(o => o.id === targetId);
      if (match) return match;
    }
    // Fallback search by activeTable
    if (activeTable) {
      const tableActiveOrders = orders
        .filter(o => o.tableNumber === activeTable && !['served', 'completed', 'rejected'].includes(o.status))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (tableActiveOrders.length > 0) return tableActiveOrders[0];

      const tableHistoryOrders = orderHistory
        .filter(o => o.tableNumber === activeTable)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (tableHistoryOrders.length > 0) return tableHistoryOrders[0];
    }
    return null;
  }, [targetId, orders, orderHistory, activeTable]);

  // States
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // Auto transition orders in mockup to simulate real-time kitchen behavior for portfolio showcase
  useEffect(() => {
    if (!order) return;
    
    let timer3: NodeJS.Timeout;

    if (order.status === 'preparing') {
      // Auto make ready after 45 seconds (mock fast cook)
      timer3 = setTimeout(() => {
        updateOrderStatus(order.id, 'ready');
      }, 45000);
    }

    return () => {
      clearTimeout(timer3);
    };
  }, [order?.status, order?.id, updateOrderStatus]);

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 flex flex-col justify-center items-center p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-2 animate-bounce" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Order Not Found</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">We couldn't locate this order in our system. Please scan and order again.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-brand-emerald text-white text-xs font-bold py-3 px-6 rounded-xl transition-all"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  // Handle PDF Generation
  const handleDownloadPDF = async () => {
    setDownloading(true);
    setDownloadSuccess(false);
    const success = await downloadReceiptPDF('receipt-container', `receipt_${order.id}.pdf`);
    setDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setFeedbackSubmitted(true);
  };

  // Status mapping to steps
  const steps = [
    { label: 'Received', status: 'pending', desc: 'Order placed, awaiting confirmation.' },
    { label: 'Accepted', status: 'accepted', desc: 'Order confirmed by cashier.' },
    { label: 'Preparing', status: 'preparing', desc: 'Chefs are brewing your delicacies.' },
    { label: 'Ready', status: 'ready', desc: 'Order ready for collection/service.' },
    { label: 'Served', status: 'served', desc: 'Delicacies successfully served!' }
  ];

  const getStepIndex = (status: string) => {
    if (status === 'rejected') return -1;
    if (status === 'completed') return 5;
    return steps.findIndex(s => s.status === status);
  };

  const activeIdx = getStepIndex(order.status);

  // Time formatting for stopwatch cooking timer
  const formatStopwatch = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-brand-cream/80 dark:bg-brand-dark-bg/85 backdrop-blur-md border-b border-brand-sage/5 dark:border-brand-dark-border/40 px-4 py-3 flex justify-between items-center max-w-xl mx-auto">
        <button 
          onClick={() => navigate(`/menu?table=${order.tableNumber}`)}
          className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-brand-sage dark:text-brand-mint cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-200">Track Order</span>
        <div className="w-10" /> {/* Balancer */}
      </header>

      <main className="max-w-xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Order Header Summary */}
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 text-center space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-brand-sage dark:text-brand-amber">
            Order Reference: {order.id}
          </p>
          <h3 className="text-2xl font-black text-brand-emerald dark:text-white font-brand-serif">
            {order.status === 'rejected' ? 'Order Cancelled' : 'Brewing in Progress'}
          </h3>
          <p className="text-xs text-slate-400">
            Table Number: <span className="font-bold text-slate-700 dark:text-slate-200">#{order.tableNumber}</span> | Guest: <span className="font-semibold text-slate-700 dark:text-slate-200">{order.customerName}</span>
          </p>

          {/* Preparation Ticking Timer */}
          {order.status === 'preparing' && (
            <div className="inline-flex flex-col items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-amber-50 dark:bg-brand-dark-bg/50 border border-brand-amber/15 text-brand-amber mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cooking Timer Elapsed</span>
              <div className="flex items-center gap-2 text-xl font-black font-mono">
                <Clock className="animate-spin-slow" size={20} />
                <span>{formatStopwatch(order.elapsedPrepTime || 0)}</span>
              </div>
            </div>
          )}

          {/* Rejection notice */}
          {order.status === 'rejected' && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/30 text-xs">
              <span className="font-bold uppercase block tracking-wider mb-1">Reason for Rejection:</span>
              <span>{order.rejectionReason || 'Kitchen too busy at the moment. Please consult the cashier counter.'}</span>
            </div>
          )}
        </div>

        {/* 2. Visual Status Stepper */}
        {order.status !== 'rejected' && (
          <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 space-y-6">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Live Status Tracker</h4>
            
            <div className="relative pl-6 border-l-2 border-slate-100 dark:border-brand-dark-border/60 ml-3 space-y-6">
              {steps.map((step, idx) => {
                const isCompleted = activeIdx >= idx;
                const isActive = activeIdx === idx;
                
                return (
                  <div key={step.label} className="relative">
                    {/* Bullet */}
                    <div className={`absolute -left-9 top-1 w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                      isCompleted 
                        ? 'bg-brand-emerald border-brand-emerald text-white dark:bg-brand-amber dark:border-brand-amber dark:text-brand-dark-bg' 
                        : 'bg-white border-slate-200 text-slate-300 dark:bg-brand-dark-card dark:border-brand-dark-border dark:text-slate-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 size={12} className="stroke-[3]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5 text-left">
                      <h5 className={`text-xs font-bold transition-colors ${
                        isActive 
                          ? 'text-brand-emerald dark:text-brand-amber text-sm font-black' 
                          : isCompleted 
                            ? 'text-slate-700 dark:text-slate-200' 
                            : 'text-slate-400'
                      }`}>
                        {step.label}
                        {isActive && (
                          <span className="ml-2 text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-amber-400/10 dark:text-brand-amber rounded pulse-animation">
                            Active
                          </span>
                        )}
                      </h5>
                      <p className={`text-[10px] ${isActive ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Preparing Details Panel - shown when order is pending/accepted/preparing */}
        {(order.status === 'pending' || order.status === 'accepted' || order.status === 'preparing') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 overflow-hidden"
          >
            {/* Panel Header */}
            <div className={`px-5 py-4 flex items-center gap-3 ${
              order.status === 'preparing'
                ? 'bg-gradient-to-r from-amber-500/10 to-orange-400/5 border-b border-amber-200/40 dark:border-amber-500/20'
                : 'bg-slate-50/80 dark:bg-brand-dark-bg/60 border-b border-slate-100 dark:border-brand-dark-border/40'
            }`}>
              <div className={`p-2 rounded-xl ${
                order.status === 'preparing' ? 'bg-amber-100 dark:bg-amber-400/15' : 'bg-slate-100 dark:bg-brand-dark-border/20'
              }`}>
                {order.status === 'preparing'
                  ? <Flame size={16} className="text-amber-500 animate-pulse" />
                  : <ChefHat size={16} className="text-slate-400" />
                }
              </div>
              <div className="text-left">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {order.status === 'preparing' ? '🔥 Currently Being Prepared' : 'Your Order Details'}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {order.status === 'preparing'
                    ? 'Our chefs are crafting your items right now!'
                    : order.status === 'accepted'
                      ? `Estimated prep time: ~${order.estimatedTime ?? 15} mins`
                      : 'Awaiting cashier confirmation...'}
                </p>
              </div>

              {/* Live prep timer (only when preparing) */}
              {order.status === 'preparing' && (
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Elapsed</span>
                  <span className="font-black font-mono text-base text-amber-500 dark:text-brand-amber">
                    {formatStopwatch(order.elapsedPrepTime || 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Per-item cards */}
            <div className="divide-y divide-slate-100 dark:divide-brand-dark-border/30">
              {order.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="flex items-start gap-4 p-4"
                >
                  {/* Product Image */}
                  <div className="relative shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl shadow-md border border-slate-100 dark:border-brand-dark-border/30"
                    />
                    {/* Quantity badge */}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-emerald dark:bg-brand-amber text-white dark:text-brand-dark-bg text-[9px] font-black rounded-full flex items-center justify-center shadow">
                      ×{item.quantity}
                    </span>
                  </div>

                  {/* Item details */}
                  <div className="flex-1 text-left">
                    <p className="font-extrabold text-sm text-slate-800 dark:text-white">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{item.product.description}</p>

                    {/* Customizations */}
                    {item.selectedCustomizations.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.selectedCustomizations.map((cust, cIdx) =>
                          cust.selections.map((sel, sIdx) => (
                            <span
                              key={`${cIdx}-${sIdx}`}
                              className="inline-block px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 text-[9px] font-bold border border-amber-200/50 dark:border-amber-400/20"
                            >
                              {cust.name}: {sel.name}
                            </span>
                          ))
                        )}
                      </div>
                    )}

                    {/* Special notes */}
                    {item.notes && (
                      <p className="mt-1.5 text-[9px] text-slate-400 italic">📝 {item.notes}</p>
                    )}

                    {/* Prep time chip */}
                    <div className="mt-2 flex items-center gap-1 text-[9px] text-slate-400">
                      <Clock size={9} />
                      <span>Est. prep: ~{item.product.preparationTime} min</span>
                    </div>
                  </div>

                  {/* Preparing animation on right side */}
                  {order.status === 'preparing' && (
                    <div className="shrink-0 flex flex-col items-center justify-center gap-1 self-center">
                      <UtensilsCrossed size={14} className="text-amber-400 animate-pulse" />
                      <span className="text-[8px] font-bold text-amber-500 uppercase tracking-wider">Cooking</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 bg-slate-50/60 dark:bg-brand-dark-bg/40 border-t border-slate-100 dark:border-brand-dark-border/30 text-center">
              <p className="text-[10px] text-slate-400">
                {order.status === 'preparing'
                  ? '⏱️ This page updates automatically in real-time.'
                  : '📋 We will notify you as soon as preparation starts.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* 3. Action Buttons (PDF Receipt & Support) */}
        <div className="flex gap-2">
          {/* PDF Receipt Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex-1 bg-brand-emerald dark:bg-brand-amber text-white dark:text-brand-dark-bg hover:bg-brand-sage dark:hover:bg-brand-gold font-extrabold py-3.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-70"
          >
            {downloading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Exporting PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 size={16} className="text-white dark:text-brand-dark-bg" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download PDF Invoice</span>
              </>
            )}
          </button>
        </div>

        {/* 4. Ordered Items Breakdown Card */}
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 space-y-4">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Order Summary</h4>
          
          <div className="divide-y divide-slate-100 dark:divide-brand-dark-border/40">
            {order.items.map((item, idx) => {
              const itemCustomCost = item.selectedCustomizations.reduce((cSum, cust) => 
                cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
              );
              const singleTotal = (item.product.price + itemCustomCost) * item.quantity;
              
              return (
                <div key={idx} className="py-3 flex justify-between items-start text-xs">
                  <div className="text-left">
                    <span className="font-bold">{item.product.name}</span>
                    <span className="text-slate-400 ml-1.5">x{item.quantity}</span>
                    {item.selectedCustomizations.length > 0 && (
                      <div className="text-[10px] text-slate-400 mt-0.5 italic">
                        {item.selectedCustomizations.map(c => c.selections.map(s => s.name).join(', ')).join(' | ')}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Rs. {singleTotal}</span>
                </div>
              );
            })}
          </div>

          {/* Pricing Totals */}
            <div className="border-t border-slate-100 dark:border-brand-dark-border/40 pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>Rs. {order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-Rs. {order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm border-t border-slate-200 dark:border-brand-dark-border/40 pt-2 text-brand-emerald dark:text-brand-amber">
                <span>Total Paid:</span>
                <span>Rs. {order.total}</span>
              </div>
            </div>
        </div>

        {/* 5. Rating & Feedback Module (Active if served / completed) */}
        {(order.status === 'ready' || order.status === 'served' || order.status === 'completed') && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 text-center space-y-4"
          >
            <div className="w-10 h-10 bg-brand-emerald/10 dark:bg-brand-amber/15 text-brand-emerald dark:text-brand-amber rounded-full flex items-center justify-center mx-auto">
              <Smile size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm">How was your Dining experience?</h4>
              <p className="text-[11px] text-slate-400 mt-1">Rate your tea taste, service speed, and smart checkout.</p>
            </div>

            {!feedbackSubmitted ? (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* 5 Stars picker */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Star 
                        size={28} 
                        fill={rating >= star ? '#f59e0b' : 'none'} 
                        className={rating >= star ? 'stroke-amber-500' : 'stroke-slate-300 dark:stroke-slate-600'}
                      />
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3 top-3 text-slate-400" />
                      <textarea
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add comments / suggestions (optional)..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl outline-none text-xs font-semibold focus:border-brand-sage"
                        rows={2}
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-brand-emerald hover:bg-brand-sage text-white font-bold text-xs py-2 px-5 rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </motion.div>
                )}
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Thank you! Your feedback has been recorded.</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      {/* Hidden Receipt container for html2canvas to capture */}
      <ReceiptPDF order={order} elementId="receipt-container" />

    </div>
  );
};
export default OrderTrackingPage;
