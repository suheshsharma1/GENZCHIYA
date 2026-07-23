import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, ShoppingBag, Plus, Minus, X, Tag, Info, Ticket, Check,
  ChevronRight, Moon, Sun, Clock, User, HeartHandshake, UtensilsCrossed 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, SelectedCustomization, CartItem } from '../types';
import { CATEGORY_MAP } from '../data/products';
import { SVGLogo } from '../components/SVGLogo';
import { PaymentModal } from '../components/PaymentModal';
import { PaymentLogo } from '../components/PaymentLogo';
import { TableSelectionModal } from '../components/TableSelectionModal';

export const MenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { 
    products, cart, activeTable, currentOrderId, activeCoupon, couponsList, favorites, 
    addToCart, removeFromCart, updateCartQuantity, applyCoupon, removeCoupon, 
    placeOrder, toggleFavorite, setTable, isDarkMode, toggleTheme, startNewSession
  } = useApp();

  const urlTable = searchParams.get('table') || '';

  // Table synchronization logic:
  // 1. Initial page load from QR scan (urlTable present, no activeTable set yet in context): initialize activeTable
  useEffect(() => {
    if (urlTable && !activeTable && !currentOrderId) {
      setTable(urlTable);
    }
  }, [urlTable, activeTable, currentOrderId, setTable]);

  // 2. When activeTable changes (e.g. via TableSelectionModal), sync browser URL search param
  useEffect(() => {
    if (activeTable && urlTable !== activeTable) {
      navigate(`/menu?table=${activeTable}`, { replace: true });
    }
  }, [activeTable, urlTable, navigate]);

  // Page States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showTableModal, setShowTableModal] = useState(false);
  
  // Customization selection state
  const [customizationSelections, setCustomizationSelections] = useState<SelectedCustomization[]>([]);
  const [customizationQuantity, setCustomizationQuantity] = useState(1);
  const [customizationNotes, setCustomizationNotes] = useState('');

  // Checkout modal state
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'khalti' | 'esewa' | 'cash'>('khalti');
  const [checkoutNotes, setCheckoutNotes] = useState('');

  // Add-to-cart success toast (non-intrusive, auto-dismiss)
  const [toast, setToast] = useState<{ name: string; quantity: number; count: number } | null>(null);
  const toastTimer = useRef<number | null>(null);
  const showAddToast = (name: string, quantity: number, count: number) => {
    setToast({ name, quantity, count });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  // Mini-cart panel open state (expanded on hover/click of floating button)
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  // Close mini-cart on outside click
  useEffect(() => {
    if (!miniCartOpen) return;
    const onDown = (e: PointerEvent) => {
      const el = document.getElementById('gc-minicart-wrap');
      if (el && !el.contains(e.target as Node)) setMiniCartOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [miniCartOpen]);

  // Payment states
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<any>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Filter products by search & category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Open Customization Modal
  const handleOpenCustomizations = (product: Product) => {
    setSelectedProduct(product);
    setCustomizationQuantity(1);
    setCustomizationNotes('');
    
    // Initialize default selections: required options get first index, multiselect starts empty
    const initialSelections: SelectedCustomization[] = [];
    if (product.customizations) {
      product.customizations.forEach(cust => {
        if (cust.type === 'select') {
          initialSelections.push({
            name: cust.name,
            selections: [{ name: cust.options[0].name, price: cust.options[0].price }]
          });
        } else {
          initialSelections.push({
            name: cust.name,
            selections: []
          });
        }
      });
    }
    setCustomizationSelections(initialSelections);
  };

  // Handle choice select (radio-style)
  const handleSelectRadio = (groupName: string, optionName: string, price: number) => {
    setCustomizationSelections(prev => prev.map(group => {
      if (group.name === groupName) {
        return {
          name: groupName,
          selections: [{ name: optionName, price }]
        };
      }
      return group;
    }));
  };

  // Handle choice toggle (checkbox-style)
  const handleToggleCheckbox = (groupName: string, optionName: string, price: number) => {
    setCustomizationSelections(prev => prev.map(group => {
      if (group.name === groupName) {
        const alreadySelected = group.selections.some(s => s.name === optionName);
        const nextSelections = alreadySelected
          ? group.selections.filter(s => s.name !== optionName)
          : [...group.selections, { name: optionName, price }];
        
        return {
          name: groupName,
          selections: nextSelections
        };
      }
      return group;
    }));
  };

  // Dynamic price summation for customizations modal
  const activeCustomizationTotal = useMemo(() => {
    if (!selectedProduct) return 0;
    const addOnsTotal = customizationSelections.reduce((sum, group) => {
      return sum + group.selections.reduce((groupSum, sel) => groupSum + sel.price, 0);
    }, 0);
    return (selectedProduct.price + addOnsTotal) * customizationQuantity;
  }, [selectedProduct, customizationSelections, customizationQuantity]);

  // Add customized item to cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, customizationQuantity, customizationSelections, customizationNotes);
    const addedName = selectedProduct.name;
    const addedQty = customizationQuantity;
    setSelectedProduct(null);

    // Keep the customer on the Menu page — just show a success toast
    // so they can continue browsing and adding more items without being
    // forced into the cart or a payment prompt.
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0) + addedQty;
    showAddToast(addedName, addedQty, totalCount);
  };

  // Calculate pricing breakdown
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const customCost = item.selectedCustomizations.reduce((cSum, cust) => 
        cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
      );
      return sum + (item.product.price + customCost) * item.quantity;
    }, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!activeCoupon) return 0;
    if (activeCoupon.discountType === 'percentage') {
      return Math.round((cartSubtotal * activeCoupon.value) / 100);
    }
    return activeCoupon.value;
  }, [activeCoupon, cartSubtotal]);

  const cartGrandTotal = cartSubtotal - discountAmount;

  // Coupon Submission
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMessage(null);
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  // Submit checkout form
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (paymentMethod === 'khalti' || paymentMethod === 'esewa') {
      setShowPaymentGateway(true);
    } else {
      processOrderPlacement();
    }
  };

  const processOrderPlacement = () => {
    const placed = placeOrder(customerName, paymentMethod, '', checkoutNotes);
    setShowCheckout(false);
    setShowCart(false);
    navigate(`/tracking/${placed.id}`);
  };

  const handlePaymentSuccess = (mobile: string) => {
    setShowPaymentGateway(false);
    processOrderPlacement();
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 pb-24 text-slate-800 dark:text-slate-100">
      
      {/* 1. Header (Sticky) */}
      <header className="sticky top-0 z-40 bg-brand-cream/80 dark:bg-brand-dark-bg/85 backdrop-blur-md border-b border-brand-sage/5 dark:border-brand-dark-border/40 px-4 py-3 flex justify-between items-center max-w-7xl mx-auto">
        <SVGLogo size={36} />

        <div className="flex items-center gap-2">
          {/* Table Badge */}
          <button 
            onClick={() => setShowTableModal(true)}
            className="bg-brand-emerald dark:bg-brand-amber text-white dark:text-brand-dark-bg font-extrabold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer border border-white/10"
            title="Click to select or switch table"
          >
            <UtensilsCrossed size={12} />
            <span>Table #{activeTable || 'Select'}</span>
          </button>

          {/* Theme Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-brand-sage dark:text-brand-mint cursor-pointer"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* History Shortcut */}
          <button 
            onClick={() => navigate('/history')}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-brand-sage dark:text-brand-mint relative cursor-pointer"
            title="Favorites & History"
          >
            <User size={18} />
          </button>
        </div>
      </header>

      {/* Active-order sticky banner — shown when customer has a placed order */}
      {currentOrderId && (
        <div
          className="sticky top-[57px] z-30 bg-brand-emerald dark:bg-brand-amber px-4 py-2 flex items-center justify-between max-w-7xl mx-auto w-full"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
        >
          <div className="flex items-center gap-2 text-white dark:text-brand-dark-bg">
            <HeartHandshake size={14} />
            <span className="text-xs font-bold">Your order is being prepared</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/tracking/${currentOrderId}`)}
              className="text-xs font-extrabold text-white dark:text-brand-dark-bg underline underline-offset-2 cursor-pointer"
            >
              Track Order →
            </button>
            <button
              onClick={startNewSession}
              className="text-[10px] font-bold text-white/70 dark:text-brand-dark-bg/70 hover:text-white dark:hover:text-brand-dark-bg cursor-pointer"
              title="Start a new order (clears current session)"
            >
              New Session
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teas, coffee, cold drinks..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-brand-dark-card border border-brand-sage/10 dark:border-brand-dark-border focus:border-brand-sage dark:focus:border-brand-amber focus:ring-2 focus:ring-brand-sage/10 dark:focus:ring-brand-amber/10 outline-none transition-all text-sm font-medium shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Horizontal scrollable category filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 mask-right">
          {Object.entries(CATEGORY_MAP).map(([key, label]) => {
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border ${
                  isActive 
                    ? 'bg-brand-emerald text-white border-brand-emerald dark:bg-brand-amber dark:text-brand-dark-bg dark:border-brand-amber' 
                    : 'bg-white dark:bg-brand-dark-card text-brand-sage dark:text-brand-mint border-brand-sage/5 dark:border-brand-dark-border/40 hover:bg-slate-50 dark:hover:bg-brand-dark-bg'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Today's Offers Strip ── */}
        {couponsList.length > 0 && (
          <div className="-mx-4 px-4 mb-2">
            <div className="bg-gradient-to-r from-brand-emerald/5 via-brand-amber/5 to-brand-emerald/5 dark:from-brand-emerald/10 dark:via-brand-amber/10 dark:to-brand-emerald/10 border border-brand-amber/15 dark:border-brand-amber/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Ticket size={12} className="text-brand-amber shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-amber">Today's Offers — Apply in Cart</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {couponsList.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      // Copy code to clipboard + open cart
                      navigator.clipboard?.writeText(c.code).catch(() => {});
                      setShowCart(true);
                    }}
                    title={`Tap to copy ${c.code} and open cart`}
                    className="shrink-0 flex items-center gap-2 bg-white dark:bg-brand-dark-card border border-brand-emerald/20 dark:border-brand-amber/20 rounded-xl px-3 py-2 hover:border-brand-emerald dark:hover:border-brand-amber transition-all cursor-pointer group"
                  >
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                      c.discountType === 'percentage'
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                    }`}>
                      {c.discountType === 'percentage' ? `${c.value}% OFF` : `Rs.${c.value} OFF`}
                    </span>
                    <span className="font-mono font-black text-[10px] text-brand-emerald dark:text-brand-amber tracking-widest">
                      {c.code}
                    </span>
                    <span className="text-[8px] text-slate-400 hidden group-hover:inline">tap to copy</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Products Grid */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold tracking-tight text-brand-emerald dark:text-white font-brand-serif">
              {CATEGORY_MAP[selectedCategory]}
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {filteredProducts.length} items available
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-brand-dark-card rounded-3xl border border-dashed border-slate-200 dark:border-brand-dark-border/60">
              <Info className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                No products found matching search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const isFavorite = favorites.includes(product.id);
                return (
                  <motion.div
                    layout
                    key={product.id}
                    className={`bg-white dark:bg-brand-dark-card rounded-2xl overflow-hidden shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 flex flex-col justify-between group transition-all hover:shadow-md ${
                      !product.available ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Veg / Non-Veg Tag */}
                      <span className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded-md text-white shadow-sm ${
                        ['veg', 'tea', 'coffee', 'cold-drinks', 'snacks-fries', 'donuts', 'cookies', 'cake'].includes(product.category) || product.name.toLowerCase().includes('veg')
                          ? 'bg-emerald-600'
                          : 'bg-red-600'
                      }`}>
                        {['veg', 'tea', 'coffee', 'cold-drinks', 'snacks-fries', 'donuts', 'cookies', 'cake'].includes(product.category) || product.name.toLowerCase().includes('veg') ? 'VEG' : 'NON-VEG'}
                      </span>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-brand-dark-bg/85 backdrop-blur-md shadow-sm hover:scale-110 active:scale-95 transition-all text-rose-500 cursor-pointer"
                      >
                        <Heart size={14} fill={isFavorite ? '#f43f5e' : 'none'} />
                      </button>

                      {/* Out of Stock Overlay */}
                      {!product.available && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-md tracking-wider">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-sm leading-tight text-slate-800 dark:text-slate-100 group-hover:text-brand-amber transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="font-extrabold text-sm text-brand-emerald dark:text-brand-amber">
                          Rs. {product.price}
                        </span>

                        {product.available ? (
                          <button
                            onClick={() => handleOpenCustomizations(product)}
                            className="bg-brand-emerald/10 dark:bg-brand-amber/15 text-brand-emerald dark:text-brand-amber hover:bg-brand-emerald hover:text-white dark:hover:bg-brand-amber dark:hover:text-brand-dark-bg font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} className="stroke-[3]" />
                            <span>Add</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 3. Floating Cart (button expands a slide-out mini-cart on hover/click) */}
      <div
        id="gc-minicart-wrap"
        className="fixed bottom-6 right-4 sm:right-6 z-40"
        onMouseEnter={() => setMiniCartOpen(true)}
        onMouseLeave={() => setMiniCartOpen(false)}
      >
        {/* Slide-out mini-cart panel */}
        <AnimatePresence>
          {miniCartOpen && cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute bottom-0 right-full mr-3 sm:mr-0 sm:right-16 sm:left-auto left-0 w-[78vw] max-w-[18rem] sm:w-64 max-h-[60vh] sm:max-h-[70vh] bg-white dark:bg-brand-dark-card rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden flex flex-col origin-bottom-right"
            >
              {/* Header */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-100 dark:border-brand-dark-border/50">
                <div className="p-1.5 rounded-lg bg-brand-emerald/10 dark:bg-brand-amber/15">
                  <ShoppingBag size={15} className="text-brand-emerald dark:text-brand-amber" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">Your Cart</p>
                  <p className="text-[9px] text-slate-400 font-medium">{cart.reduce((s, i) => s + i.quantity, 0)} items added</p>
                </div>
              </div>

              {/* Scrollable product list (latest up to 5) */}
              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 scrollbar-thin">
                {cart.slice(-5).map((item) => {
                  const unit = item.product.price + item.selectedCustomizations.reduce(
                    (cSum, cust) => cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
                  );
                  const lineTotal = unit * item.quantity;
                  return (
                    <div key={item.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.quantity > 1
                            ? `${item.quantity} × Rs. ${unit.toLocaleString()}`
                            : `Rs. ${unit.toLocaleString()}`}
                          <span className="font-semibold text-brand-emerald dark:text-brand-amber">
                            {'  ·  Rs. '}{lineTotal.toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
                {cart.length > 5 && (
                  <p className="text-[9px] text-center text-slate-400 font-medium pt-1">
                    +{cart.length - 5} more items in your cart
                  </p>
                )}
              </div>

              {/* Footer: totals + View Cart */}
              <div className="px-4 py-3 border-t border-slate-100 dark:border-brand-dark-border/50 bg-slate-50/70 dark:bg-brand-dark-bg/50">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grand Total</span>
                  <span className="text-sm font-extrabold text-brand-emerald dark:text-brand-amber">
                    Rs. {cartGrandTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => { setMiniCartOpen(false); setShowCart(true); }}
                  className="w-full bg-brand-emerald dark:bg-brand-amber hover:bg-brand-sage dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  View Cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating cart button */}
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => { setMiniCartOpen(false); setShowCart(true); }}
          className="relative bg-brand-emerald dark:bg-brand-amber hover:bg-brand-sage dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-extrabold px-5 py-4 rounded-2xl shadow-xl shadow-brand-emerald/25 dark:shadow-brand-amber/25 flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-emerald dark:border-brand-amber">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <span className="text-xs uppercase tracking-wider font-bold border-l border-white/20 dark:border-brand-dark-bg/20 pl-3">
            {cart.length > 0 ? `Rs. ${cartGrandTotal.toLocaleString()}` : 'View Cart'}
          </span>
        </motion.button>
      </div>

      {/* Add-to-cart success toast (non-intrusive, auto-dismiss) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
          >
            <div className="bg-brand-emerald dark:bg-brand-amber text-white dark:text-brand-dark-bg font-bold text-xs px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2">
              <Check size={14} className="shrink-0" />
              <span>
                <span className="font-extrabold">{toast.name}</span>
                {toast.quantity > 1 && <span> ×{toast.quantity}</span>} added to cart
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Customization Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="relative w-full sm:max-w-lg bg-white dark:bg-brand-dark-card rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-800 dark:text-slate-100"
            >
              {/* Product Header Photo */}
              <div className="relative h-44 bg-slate-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-brand-emerald dark:text-white font-brand-serif">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mt-2">
                    <Clock size={12} />
                    <span>Est. Cook Time: {selectedProduct.preparationTime} mins</span>
                  </div>
                </div>

                {/* Customizations loop */}
                {selectedProduct.customizations && selectedProduct.customizations.map((custGroup) => {
                  // Find current selected values for this group
                  const selectedGroup = customizationSelections.find(g => g.name === custGroup.name);
                  
                  return (
                    <div key={custGroup.name} className="space-y-2 border-t border-slate-100 dark:border-brand-dark-border/40 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-brand-emerald dark:text-brand-amber uppercase tracking-wider">
                          {custGroup.name}
                        </span>
                        {custGroup.required ? (
                          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald dark:bg-brand-amber/15 dark:text-brand-amber">
                            Required
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-bold text-slate-400">
                            Optional (Multiselect)
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {custGroup.options.map(option => {
                          const isSelected = selectedGroup?.selections.some(s => s.name === option.name) || false;
                          
                          return (
                            <button
                              key={option.name}
                              onClick={() => {
                                if (custGroup.type === 'select') {
                                  handleSelectRadio(custGroup.name, option.name, option.price);
                                } else {
                                  handleToggleCheckbox(custGroup.name, option.name, option.price);
                                }
                              }}
                              className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-brand-emerald bg-brand-emerald/5 dark:border-brand-amber dark:bg-brand-amber/5'
                                  : 'border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-brand-dark-bg'
                              }`}
                            >
                              <span className="text-xs font-semibold">{option.name}</span>
                              {option.price > 0 && (
                                <span className="text-[10px] font-bold text-brand-emerald dark:text-brand-amber">
                                  +Rs. {option.price}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Preparation Note */}
                <div className="space-y-2 border-t border-slate-100 dark:border-brand-dark-border/40 pt-4">
                  <label className="text-xs font-bold text-brand-emerald dark:text-brand-amber uppercase tracking-wider block">
                    Special Preparation Notes
                  </label>
                  <input
                    type="text"
                    value={customizationNotes}
                    onChange={(e) => setCustomizationNotes(e.target.value)}
                    placeholder="E.g., No ice, extra spicy, sauce on the side..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage outline-none text-xs"
                  />
                </div>
              </div>

              {/* Cart Add Footer */}
              <div className="p-4 bg-slate-50 dark:bg-brand-dark-bg/60 border-t border-slate-100 dark:border-brand-dark-border/40 flex justify-between items-center">
                {/* Quantity Selector */}
                <div className="flex items-center gap-3 bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-brand-dark-border rounded-xl px-2.5 py-1.5 shadow-sm">
                  <button
                    disabled={customizationQuantity <= 1}
                    onClick={() => setCustomizationQuantity(prev => prev - 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <Minus size={14} className="stroke-[2.5]" />
                  </button>
                  <span className="font-extrabold text-sm text-brand-emerald dark:text-brand-amber w-6 text-center">
                    {customizationQuantity}
                  </span>
                  <button
                    onClick={() => setCustomizationQuantity(prev => prev + 1)}
                    className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                  >
                    <Plus size={14} className="stroke-[2.5]" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-brand-emerald dark:bg-brand-amber hover:bg-brand-sage dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-extrabold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-brand-emerald/10 cursor-pointer"
                >
                  <span>Add to Cart</span>
                  <ChevronRight size={14} />
                  <span className="border-l border-white/20 dark:border-brand-dark-bg/20 pl-2">
                    Rs. {activeCustomizationTotal}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Cart Drawer (Slide Over Panel) */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide drawer container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-white dark:bg-brand-dark-card flex flex-col shadow-2xl text-slate-800 dark:text-slate-100"
              >
                {/* Header */}
                <div className="px-5 py-4 bg-brand-emerald dark:bg-brand-dark-bg text-white flex justify-between items-center border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={20} className="text-brand-amber" />
                    <span className="font-extrabold text-sm uppercase tracking-wider">Your Order Drawer</span>
                  </div>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scrollable list */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center space-y-3">
                      <ShoppingBag size={48} className="text-slate-300 dark:text-slate-600" />
                      <div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Your Cart is Empty</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Go back to the digital menu to select delicacies.</p>
                      </div>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const itemCustomCost = item.selectedCustomizations.reduce((cSum, cust) => 
                        cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
                      );
                      const basePlusCustoms = item.product.price + itemCustomCost;

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl border border-slate-100 dark:border-brand-dark-border/40 bg-slate-50/50 dark:bg-brand-dark-bg/25 space-y-2 flex gap-3 items-start"
                        >
                          {/* Product image */}
                          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-xs leading-snug">{item.product.name}</h5>

                                {/* Customizations display */}
                              {item.selectedCustomizations.length > 0 && (
                                <div className="text-[10px] text-slate-400 mt-1 italic font-normal">
                                  {item.selectedCustomizations.map((cust, cIdx) => (
                                    <div key={cIdx}>
                                      • {cust.name}: {cust.selections.map(s => `${s.name} (+Rs.${s.price})`).join(', ')}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {item.notes && (
                                <div className="text-[9px] text-brand-amber font-semibold mt-1">
                                  Note: {item.notes}
                                </div>
                              )}
                            </div>

                            <span className="font-extrabold text-xs text-brand-emerald dark:text-brand-amber whitespace-nowrap">
                              Rs. {(basePlusCustoms * item.quantity).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[10px] font-bold text-[#FF6B6B] hover:underline cursor-pointer"
                            >
                              Remove
                            </button>

                            {/* Quantity Stepper */}
                            <div className="flex items-center gap-2.5 bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-brand-dark-border rounded-lg px-2 py-1 shadow-sm">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                              >
                                <Minus size={11} className="stroke-[3]" />
                              </button>
                              <span className="font-extrabold text-[11px] text-brand-emerald dark:text-brand-amber w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                              >
                                <Plus size={11} className="stroke-[3]" />
                              </button>
                            </div>
                          </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Cart pricing summary details & Coupon support */}
                {cart.length > 0 && (
                  <div className="p-5 border-t border-slate-100 dark:border-brand-dark-border/40 bg-slate-50 dark:bg-brand-dark-bg/60 space-y-4">
                    {/* Coupon Form */}
                    {!activeCoupon ? (
                      <>
                        {/* Available codes hint */}
                        {couponsList.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Ticket size={9} />
                              Available Codes
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {couponsList.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => setCouponInput(c.code)}
                                  title={c.description || ''}
                                  className="font-mono text-[9px] font-black tracking-widest text-brand-emerald dark:text-brand-amber bg-brand-emerald/8 dark:bg-brand-amber/10 border border-brand-emerald/20 dark:border-brand-amber/20 px-2 py-1 rounded-lg hover:bg-brand-emerald/15 dark:hover:bg-brand-amber/20 transition-colors cursor-pointer"
                                >
                                  {c.code} &mdash; {c.discountType === 'percentage' ? `${c.value}%` : `Rs.${c.value}`} off
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Enter Coupon Code"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card rounded-xl outline-none text-xs font-semibold focus:border-brand-sage uppercase tracking-wider"
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-brand-emerald dark:bg-brand-amber hover:bg-brand-sage dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-bold text-xs px-4 rounded-xl shadow transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3.5 py-2.5 rounded-xl">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                          <Tag size={14} className="stroke-[2.5]" />
                          <div className="text-left">
                            <p className="text-[11px] font-bold tracking-wider">{activeCoupon.code}</p>
                            <p className="text-[9px] text-emerald-600/80 dark:text-emerald-500/80">{activeCoupon.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {couponMessage && (
                      <p className={`text-[10px] font-semibold px-1 mt-[-6px] ${couponMessage.success ? 'text-emerald-600' : 'text-red-500'}`}>
                        {couponMessage.text}
                      </p>
                    )}

                    {/* Breakdown */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Items Subtotal:</span>
                        <span>Rs. {cartSubtotal.toLocaleString()}</span>
                      </div>
                      {activeCoupon && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Coupon Discount:</span>
                          <span>-Rs. {discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-extrabold text-sm border-t border-slate-200 dark:border-brand-dark-border/40 pt-2 text-brand-emerald dark:text-brand-amber">
                        <span>Grand Total:</span>
                        <span>Rs. {cartGrandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => {
                        setShowCheckout(true);
                      }}
                      className="w-full bg-brand-emerald dark:bg-brand-amber hover:bg-brand-sage dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-extrabold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ChevronRight size={14} className="stroke-[2.5]" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Checkout Info Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-brand-dark-border/40"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-brand-emerald dark:text-white font-brand-serif">
                  Complete Your Order
                </h4>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Your Name (For Order Ticket)
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="E.g., Aarav Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/10 outline-none text-xs font-semibold dark:text-white"
                  />
                </div>


                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Pre-order cooking preferences
                  </label>
                  <input
                    type="text"
                    value={checkoutNotes}
                    onChange={(e) => setCheckoutNotes(e.target.value)}
                    placeholder="E.g., Serve hot drinks first..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/10 outline-none text-xs font-semibold dark:text-white"
                  />
                </div>

                {/* Payment Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`p-3 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'khalti'
                          ? 'border-[#5C2D91] bg-[#5C2D91]/10 shadow-lg shadow-[#5C2D91]/20'
                          : 'border-slate-200 dark:border-brand-dark-border hover:border-[#5C2D91]/50 hover:bg-[#5C2D91]/5'
                      }`}
                    >
                      <PaymentLogo provider="khalti" className="w-10 h-10" />
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        paymentMethod === 'khalti' ? 'text-[#5C2D91]' : 'text-slate-600 dark:text-slate-300'
                      }`}>Khalti</span>
                      <span className="text-[8px] uppercase tracking-wider font-semibold text-slate-400">Digital Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`p-3 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'esewa'
                          ? 'border-[#E85D04] bg-[#E85D04]/10 shadow-lg shadow-[#E85D04]/20'
                          : 'border-slate-200 dark:border-brand-dark-border hover:border-[#E85D04]/50 hover:bg-[#E85D04]/5'
                      }`}
                    >
                      <PaymentLogo provider="esewa" className="w-10 h-10" />
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        paymentMethod === 'esewa' ? 'text-[#E85D04]' : 'text-slate-600 dark:text-slate-300'
                      }`}>Esewa</span>
                      <span className="text-[8px] uppercase tracking-wider font-semibold text-slate-400">Digital Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-lg shadow-emerald-500/20'
                          : 'border-slate-200 dark:border-brand-dark-border hover:border-emerald-500/50 hover:bg-emerald-50/50'
                      }`}
                    >
                      <PaymentLogo provider="cash" className="w-10 h-10" />
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        paymentMethod === 'cash' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'
                      }`}>Cash</span>
                      <span className="text-[8px] uppercase tracking-wider font-semibold text-slate-400">Pay at Counter</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-brand-emerald/8 text-brand-emerald dark:text-brand-mint border border-brand-emerald/15 dark:border-brand-mint/20 rounded-xl flex gap-2 items-center text-[10px]">
                  <HeartHandshake size={15} className="shrink-0" />
                  <p className="leading-relaxed font-semibold">
                    Your order will be sent to our kitchen right away. Staff will call your name when ready! ☕
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-brand-emerald dark:bg-brand-amber hover:bg-brand-sage dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider cursor-pointer"
                >
                  Pay & Place Order (Rs. {cartGrandTotal.toLocaleString()})
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Gateway Modal Simulation */}
      {paymentMethod === 'khalti' || paymentMethod === 'esewa' ? (
        <PaymentModal
          isOpen={showPaymentGateway}
          onClose={() => setShowPaymentGateway(false)}
          onSuccess={handlePaymentSuccess}
          amount={cartGrandTotal}
          orderId={`CS-TEMP-${1000 + cart.length}`}
          provider={paymentMethod as 'khalti' | 'esewa'}
        />
      ) : null}

      {/* Table Selection & Switcher Modal */}
      <TableSelectionModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
      />

    </div>
  );
};
export default MenuPage;
