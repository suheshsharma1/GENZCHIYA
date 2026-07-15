import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShoppingBag, Users, DollarSign, Check, X, Printer, TrendingUp, 
  TrendingDown, Plus, Edit2, LogOut, RefreshCw, BarChart2, Coffee, 
  Layers, FileText, CheckCircle2, AlertCircle, Trash, Search, Settings,
  Bell, LayoutGrid, List, ChefHat, Timer, BellRing, ChevronRight, QrCode, Download, Minus
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { Order, Product, OrderStatus } from '../types';
import { ReceiptPDF } from '../components/ReceiptPDF';
import { downloadReceiptPDF } from '../utils/pdf';
import { SVGLogo } from '../components/SVGLogo';

/* ─── Table QR Card Component (Local Helper) ──────────────────────────────── */
interface TableCardProps {
  tableNumber: string;
  baseUrl: string;
}

const TableQRCard: React.FC<TableCardProps> = ({ tableNumber, baseUrl }) => {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const orderUrl = `${baseUrl}/menu?table=${tableNumber}`;
    QRCode.toDataURL(orderUrl, {
      margin: 1,
      width: 280,
      errorCorrectionLevel: 'H',
      color: { dark: '#1B3B2B', light: '#FFFFFF' },
    })
      .then(url => setQrUrl(url))
      .catch(err => console.error('QR generation failed:', err));
  }, [tableNumber, baseUrl]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `table-${tableNumber}-qr.png`;
    a.click();
  };

  return (
    <div className="group relative">
      <button
        onClick={handleDownload}
        title="Download QR image"
        className="absolute top-2 right-2 z-10 bg-brand-emerald text-white rounded-full p-1.5 shadow-md hover:bg-brand-sage transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
      >
        <Download size={12} />
      </button>

      <div
        id={`qr-card-${tableNumber}`}
        className="bg-white border-2 border-brand-emerald/20 rounded-3xl flex flex-col items-center text-center px-5 pt-5 pb-4 shadow-sm hover:shadow-md transition-shadow w-[230px] mx-auto relative overflow-hidden"
        style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
      >
        {/* Logo */}
        <div className="mb-2">
          <SVGLogo variant="full" size={32} />
        </div>

        {/* Thin decorative line */}
        <div className="w-12 h-px bg-brand-amber/40 mb-3" />

        {/* Table label */}
        <p className="text-[9px] font-extrabold tracking-[0.25em] text-brand-amber uppercase mb-0.5">
          Table Number
        </p>

        {/* Table number */}
        <h2
          className="text-4xl font-black text-brand-emerald leading-none mb-3"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          #{tableNumber}
        </h2>

        {/* QR Code */}
        <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-inner mb-3">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt={`Table ${tableNumber} QR Code`}
              className="w-32 h-32 block"
              draggable={false}
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-slate-50 rounded-xl">
              <div className="flex flex-col items-center gap-1.5 text-slate-300">
                <QrCode size={24} className="animate-pulse" />
                <span className="text-[8px] font-medium">Generating…</span>
              </div>
            </div>
          )}
        </div>

        {/* Scan to Order */}
        <p className="text-[9px] font-black tracking-[0.2em] text-brand-emerald uppercase mb-1">
          Scan to Order
        </p>
        <p className="text-[8px] text-slate-400 leading-relaxed max-w-[170px] mb-3">
          Scan this code using your phone camera or Viber/WhatsApp scanner to browse
          the digital menu and place your order instantly.
        </p>

        {/* Footer steps */}
        <div className="w-full border-t border-dashed border-slate-200 pt-2 flex justify-between items-center px-1 text-[7px] font-bold text-slate-400 uppercase tracking-wide">
          <span>1. Scan QR</span>
          <span className="text-slate-200">|</span>
          <span>2. Pay Digital</span>
          <span className="text-slate-200">|</span>
          <span>3. Enjoy Tea</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Unified Page Component ─────────────────────────────────────────── */
export const SplitDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    orders, products, activeTable, updateOrderStatus, toggleProductAvailability, 
    updateProductPrice, updateProductImage, deleteProduct, addProduct, getSalesReport, resetAllData, logoutStaff 
  } = useApp();

  // Layout Preference State (Split Screen vs Cashier Focus vs Kitchen Focus)
  const [layoutMode, setLayoutMode] = useState<'split' | 'cashier' | 'kitchen'>(() => {
    if (window.location.pathname === '/kitchen') return 'kitchen';
    const savedRole = localStorage.getItem('gc_user_role');
    if (savedRole === 'kitchen') return 'kitchen';
    if (savedRole === 'cashier') return 'split';
    return 'split';
  });

  // Cashier Active Tab State
  const [cashierTab, setCashierTab] = useState<'orders' | 'menu' | 'reports' | 'qr'>('orders');

  // Kitchen filter state
  const [kitchenFilter, setKitchenFilter] = useState<'all' | 'preparing' | 'ready'>('all');

  // General Notification / Alert Sound state
  const [showNewOrderPopup, setShowNewOrderPopup] = useState(false);
  const [newOrderPopupData, setNewOrderPopupData] = useState<Order | null>(null);
  const prevPendingCountRef = useRef(0);

  // Kitchen alerts state
  const [kitchenNewOrderAlert, setKitchenNewOrderAlert] = useState(false);
  const [kitchenLastOrderCount, setKitchenLastOrderCount] = useState(0);

  // Modals state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptOrderId, setAcceptOrderId] = useState('');
  const [estTimeInput, setEstTimeInput] = useState(15);

  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);

  // Menu editor layout and configuration
  const [menuViewMode, setMenuViewMode] = useState<'grid' | 'table'>('grid');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Form states for adding/editing products
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(150);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCat, setNewProdCat] = useState('tea');
  const [newProdImg, setNewProdImg] = useState('');
  const [newProdPrep, setNewProdPrep] = useState(5);

  const [editingProductId, setEditingProductId] = useState('');
  const [editingProductName, setEditingProductName] = useState('');
  const [editImageURL, setEditImageURL] = useState('');

  const [deletingProductId, setDeletingProductId] = useState('');
  const [deletingProductName, setDeletingProductName] = useState('');

  // Table QR count and base URL config states
  const [tableCount, setTableCount] = useState(25);
  const [qrBaseUrl, setQrBaseUrl] = useState(() =>
    localStorage.getItem('gc_qr_base_url') || window.location.origin
  );

  // Persist qrBaseUrl to localStorage so LandingPage QR cards use the same IP
  useEffect(() => {
    localStorage.setItem('gc_qr_base_url', qrBaseUrl);
  }, [qrBaseUrl]);

  // Memoized listings and calculations
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending'), [orders]);
  const activeOrders = useMemo(() => orders.filter(o => ['preparing', 'ready'].includes(o.status)), [orders]);

  const kitchenTickets = useMemo(() => {
    return orders
      .filter(o => ['preparing', 'ready'].includes(o.status))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [orders]);

  const preparingTickets = useMemo(() => kitchenTickets.filter(o => o.status === 'preparing'), [kitchenTickets]);
  const readyTickets = useMemo(() => kitchenTickets.filter(o => o.status === 'ready'), [kitchenTickets]);

  const displayedKitchenTickets = useMemo(() => {
    if (kitchenFilter === 'preparing') return preparingTickets;
    if (kitchenFilter === 'ready') return readyTickets;
    return kitchenTickets;
  }, [kitchenFilter, preparingTickets, readyTickets, kitchenTickets]);

  const batchSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    preparingTickets.forEach(ticket => {
      ticket.items.forEach(item => {
        const customText = item.selectedCustomizations.length > 0 
          ? ` (${item.selectedCustomizations.map(c => c.selections.map(s => s.name).join(', ')).join(' | ')})`
          : '';
        const key = `${item.product.name}${customText}`;
        summary[key] = (summary[key] || 0) + item.quantity;
      });
    });
    return Object.entries(summary).sort((a, b) => b[1] - a[1]);
  }, [preparingTickets]);

  const report = getSalesReport();

  const hourlyData = useMemo(() => {
    const data = [];
    for (let h = 9; h <= 20; h++) {
      data.push({
        hour: `${h}:00`,
        Orders: report.ordersByHour[h] || 0
      });
    }
    return data;
  }, [report]);

  const categoryData = useMemo(() => {
    return Object.entries(report.revenueByCategory).map(([cat, rev]) => ({
      name: cat.toUpperCase(),
      Revenue: rev
    }));
  }, [report]);

  const paymentPieData = useMemo(() => {
    return [
      { name: 'Khalti', value: report.revenueByPaymentMethod.khalti },
      { name: 'Esewa', value: report.revenueByPaymentMethod.esewa },
      { name: 'Cash', value: report.revenueByPaymentMethod.cash }
    ].filter(p => p.value > 0);
  }, [report]);

  const COLORS = ['#5C2D91', '#2C5E43', '#D4A373'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(menuSearch.toLowerCase());
      const matchCat = menuFilterCategory === 'all' || p.category === menuFilterCategory;
      return matchSearch && matchCat;
    });
  }, [products, menuSearch, menuFilterCategory]);

  // Audio trigger
  const playOrderAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Timer notification listeners
  useEffect(() => {
    const currentPendingCount = pendingOrders.length;
    if (currentPendingCount > prevPendingCountRef.current && prevPendingCountRef.current > -1) {
      const newestPending = pendingOrders[pendingOrders.length - 1];
      if (newestPending) {
        setNewOrderPopupData(newestPending);
        setShowNewOrderPopup(true);
        playOrderAlertSound();
      }
    }
    prevPendingCountRef.current = currentPendingCount;
  }, [pendingOrders]);

  useEffect(() => {
    const incomingCount = orders.filter(o => o.status === 'preparing').length;
    if (incomingCount > kitchenLastOrderCount) {
      setKitchenNewOrderAlert(true);
      playOrderAlertSound();
      const t = setTimeout(() => setKitchenNewOrderAlert(false), 4000);
      return () => clearTimeout(t);
    }
    setKitchenLastOrderCount(incomingCount);
  }, [orders, kitchenLastOrderCount]);

  // Helpers
  const formatStopwatch = (totalSeconds?: number) => {
    if (totalSeconds === undefined) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRs = (num: number) => `Rs. ${num.toLocaleString()}`;

  // Logouts & system resets
  const handleLogout = () => {
    logoutStaff();
    navigate('/login');
  };

  const handlePrintReceipt = async (order: Order) => {
    setActiveReceiptOrder(order);
    setTimeout(async () => {
      await downloadReceiptPDF('cashier-receipt-container', `receipt_${order.id}.pdf`);
    }, 100);
  };

  const handleAcceptOrder = (orderId: string) => {
    setAcceptOrderId(orderId);
    setEstTimeInput(15);
    setShowAcceptModal(true);
  };

  const confirmAccept = () => {
    updateOrderStatus(acceptOrderId, 'preparing', { estTime: estTimeInput });
    setShowAcceptModal(false);
  };

  const handleRejectOrder = (orderId: string) => {
    setRejectOrderId(orderId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    updateOrderStatus(rejectOrderId, 'rejected', { rejectionReason });
    setShowRejectModal(false);
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const imgUrl = newProdImg.trim() || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80";
    addProduct({
      name: newProdName,
      price: Number(newProdPrice),
      description: newProdDesc,
      category: newProdCat,
      image: imgUrl,
      preparationTime: Number(newProdPrep)
    });
    setNewProdName('');
    setNewProdPrice(150);
    setNewProdDesc('');
    setNewProdImg('');
    setNewProdPrep(5);
    setShowAddProductModal(false);
  };

  // Edit Image Submission
  const handleEditImage = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProductName(product.name);
    setEditImageURL(product.image);
    setShowEditImageModal(true);
  };

  const handleEditImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;
    updateProductImage(editingProductId, editImageURL.trim());
    setShowEditImageModal(false);
    setEditingProductId('');
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProductId(product.id);
    setDeletingProductName(product.name);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteProduct = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setShowDeleteConfirmModal(false);
      setDeletingProductId('');
    }
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'served');
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Invoice ID,Date,Table,Customer Name,Subtotal,Discount,Grand Total,Payment Method,Status\n";
    completedOrders.forEach(o => {
      csvContent += `${o.id},"${new Date(o.createdAt).toLocaleDateString()}",${o.tableNumber},"${o.customerName}",${o.subtotal},${o.discount},${o.total},${o.payment.method},${o.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `genzchiya_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* ── HEADER & NAVIGATION CONTROLLER ── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-brand-dark-card/90 backdrop-blur-md border-b border-slate-200/60 dark:border-brand-dark-border/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <SVGLogo size={36} />
          <div>
            <h1 className="text-sm font-black text-brand-emerald dark:text-white tracking-tight uppercase">GENZCHIYA</h1>
            <p className="text-[10px] font-bold text-brand-amber uppercase tracking-widest leading-none">Smart Staff Workspace</p>
          </div>
        </div>

        {/* Sliding Panel Layout Switcher */}
        <div className="bg-slate-100 dark:bg-brand-dark-bg rounded-2xl p-1 flex gap-1 border border-slate-200/50 dark:border-brand-dark-border/30">
          {[
            { key: 'cashier', label: '💻 Cashier Focus' },
            { key: 'split', label: '🥞 Split Screen' },
            { key: 'kitchen', label: '🍳 Kitchen Focus' }
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setLayoutMode(opt.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                layoutMode === opt.key 
                  ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Reset button */}
          <button 
            onClick={resetAllData}
            className="p-2 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-100 dark:hover:bg-brand-dark-bg rounded-xl transition-all cursor-pointer text-slate-400"
            title="Reset System DB"
          >
            <RefreshCw size={14} />
          </button>

          {/* Exit Portal */}
          <button
            onClick={handleLogout}
            className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Exit Portal</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE PANELS ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT PANEL: CASHIER */}
        {(layoutMode === 'split' || layoutMode === 'cashier') && (
          <section className={`flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-brand-dark-border/40 min-h-0 bg-white/40 dark:bg-brand-dark-card/10 overflow-y-auto p-6 ${
            layoutMode === 'cashier' ? 'w-full' : 'lg:w-1/2'
          }`}>
            
            {/* Cashier Sidebar-like Tabs */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-black text-brand-emerald dark:text-white uppercase tracking-wider flex items-center gap-2">
                <LayoutGrid size={18} className="text-brand-amber" />
                <span>Cashier</span>
              </h2>

              <div className="flex gap-1.5 bg-slate-100 dark:bg-brand-dark-bg p-1 rounded-xl border border-slate-200/40 dark:border-brand-dark-border/20">
                {[
                  { key: 'orders', label: 'Live Queue' },
                  { key: 'menu', label: 'Menu Editor' },
                  { key: 'reports', label: 'Sales Reports' },
                  { key: 'qr', label: 'Generate QR' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setCashierTab(tab.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                      cashierTab === tab.key 
                        ? 'bg-white dark:bg-brand-dark-card text-brand-emerald dark:text-brand-amber shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB 1: Live Queue */}
            {cashierTab === 'orders' && (
              <div className="space-y-6">
                {/* Micro Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Today's Orders", val: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length, color: 'text-slate-700 dark:text-white' },
                    { label: "Pending Approvals", val: pendingOrders.length, color: 'text-rose-500' },
                    { label: "Active Prep", val: orders.filter(o => o.status === 'preparing').length, color: 'text-amber-500' },
                    { label: "Serving Ready", val: orders.filter(o => o.status === 'ready').length, color: 'text-emerald-500' }
                  ].map(st => (
                    <div key={st.label} className="bg-white dark:bg-brand-dark-card p-3 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/30 text-left">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{st.label}</span>
                      <p className={`text-xl font-black ${st.color} mt-0.5`}>{st.val}</p>
                    </div>
                  ))}
                </div>

                {/* Pending Confirmations Section */}
                {pendingOrders.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1">
                      <AlertCircle size={14} className="animate-pulse" />
                      <span>Needs Confirmation ({pendingOrders.length})</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pendingOrders.map(order => (
                        <div key={order.id} className="bg-rose-50/10 dark:bg-rose-950/5 border-2 border-rose-500/20 rounded-2xl p-4 flex flex-col justify-between text-left shadow-sm">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] font-mono font-bold text-rose-600 dark:text-rose-400">ID: {order.id}</span>
                              <span className="bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg text-[9px] font-black px-2 py-0.5 rounded-lg">
                                Table #{order.tableNumber}
                              </span>
                            </div>
                            <p className="text-xs font-extrabold mb-1">
                              {order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}
                            </p>
                            {order.notes && <p className="text-[9px] text-slate-400 italic mb-2">Note: {order.notes}</p>}
                            <p className="text-[10px] text-slate-400 font-semibold">Total: <span className="font-extrabold text-slate-700 dark:text-slate-200">{formatRs(order.total)}</span> | {order.payment.method.toUpperCase()}</p>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => handleAcceptOrder(order.id)} className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-1.5 rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer">
                              <Check size={12} />
                              <span>Accept</span>
                            </button>
                            <button onClick={() => handleRejectOrder(order.id)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-1.5 rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer">
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Preparations Tracker */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 text-left">Active Cashier Queue</h4>
                  {activeOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-brand-dark-border/40">
                      <CheckCircle2 size={24} className="mx-auto text-slate-300 dark:text-slate-600 mb-1.5" />
                      <p className="text-slate-400 text-[11px] font-semibold">No active cashier items.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeOrders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-brand-dark-card border border-slate-200/60 dark:border-brand-dark-border/50 rounded-2xl p-4 flex flex-col justify-between text-left shadow-sm">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] font-mono font-bold text-slate-400">ID: {order.id}</span>
                              <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                order.status === 'ready' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-xs font-extrabold">Table #{order.tableNumber}</h4>
                              <span className="text-[9px] text-slate-400 font-semibold">{order.customerName}</span>
                            </div>
                            <div className="text-[11px] font-extrabold border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span>• {item.product.name} x{item.quantity}</span>
                                  {item.selectedCustomizations.length > 0 && (
                                    <span className="text-[9px] text-slate-400 font-normal">
                                      {item.selectedCustomizations.map(c => c.selections.map(s => s.name).join(', ')).join(' | ')}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 mt-4">
                            <button onClick={() => handlePrintReceipt(order)} className="p-2 bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 rounded-xl transition-colors cursor-pointer" title="Print Receipt">
                              <Printer size={13} />
                            </button>
                            {order.status === 'preparing' && (
                              <button onClick={() => updateOrderStatus(order.id, 'ready')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 rounded-xl text-[10px] cursor-pointer">
                                Mark Ready
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button onClick={() => updateOrderStatus(order.id, 'served')} className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-1.5 rounded-xl text-[10px] cursor-pointer">
                                Mark Served
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Menu Management */}
            {cashierTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
                  <div className="flex gap-1.5 flex-1">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        placeholder="Search menu..."
                        className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card rounded-xl outline-none text-xs"
                      />
                    </div>
                    <select
                      value={menuFilterCategory}
                      onChange={(e) => setMenuFilterCategory(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card rounded-xl outline-none text-[11px] font-bold"
                    >
                      <option value="all">All</option>
                      <option value="tea">Tea</option>
                      <option value="coffee">Coffee</option>
                      <option value="cold-drinks">Cold Drinks</option>
                      <option value="snacks">Snacks</option>
                      <option value="sandwich">Sandwiches</option>
                      <option value="burger">Burgers</option>
                      <option value="pizza">Pizza</option>
                      <option value="bakery">Bakery</option>
                    </select>
                  </div>

                  <div className="flex gap-1.5 items-center justify-between">
                    <div className="bg-slate-100 dark:bg-brand-dark-bg p-0.5 rounded-xl flex border border-slate-200/40 dark:border-brand-dark-border/20">
                      <button onClick={() => setMenuViewMode('grid')} className={`p-1.5 rounded-lg transition-all cursor-pointer ${menuViewMode === 'grid' ? 'bg-white dark:bg-brand-dark-card text-brand-emerald dark:text-brand-amber shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={12} /></button>
                      <button onClick={() => setMenuViewMode('table')} className={`p-1.5 rounded-lg transition-all cursor-pointer ${menuViewMode === 'table' ? 'bg-white dark:bg-brand-dark-card text-brand-emerald dark:text-brand-amber shadow-sm' : 'text-slate-400'}`}><List size={12} /></button>
                    </div>
                    <button onClick={() => setShowAddProductModal(true)} className="bg-brand-emerald hover:bg-brand-sage text-white font-bold text-xs py-2 px-3 rounded-xl shadow flex items-center gap-1.5 cursor-pointer">
                      <Plus size={12} className="stroke-[3]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {menuViewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredProducts.map(p => (
                      <div key={p.id} className="bg-white dark:bg-brand-dark-card rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 flex flex-col justify-between text-left group">
                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-2 left-2 bg-brand-emerald text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">{p.category}</span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white line-clamp-1">{p.name}</h4>
                              <span className="font-black text-brand-emerald dark:text-brand-amber text-[10px] shrink-0">{formatRs(p.price)}</span>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-2 h-6">{p.description}</p>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1">
                            <span className="text-[9px] text-slate-400 font-semibold">Prep: {p.preparationTime}m</span>
                            <button onClick={() => toggleProductAvailability(p.id)} className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase cursor-pointer ${p.available ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'}`}>
                              {p.available ? 'In Stock' : 'Out'}
                            </button>
                          </div>
                          <div className="flex gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                            <button onClick={() => {
                              const newPrice = prompt(`New price for ${p.name}:`, String(p.price));
                              if (newPrice && !isNaN(Number(newPrice))) updateProductPrice(p.id, Number(newPrice));
                            }} className="flex-1 py-1 px-1 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-brand-dark-bg/40 rounded-lg text-[9px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-0.5 cursor-pointer">
                              <Edit2 size={8} /><span>Price</span>
                            </button>
                            <button onClick={() => handleEditImage(p)} className="p-1 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-brand-dark-bg/40 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer" title="Edit Image"><Settings size={9} /></button>
                            <button onClick={() => handleDeleteProduct(p)} className="p-1 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-500 cursor-pointer" title="Delete"><Trash size={9} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-brand-dark-bg text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-brand-dark-border/30">
                          <th className="p-3">Item Details</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="border-b border-slate-100 dark:border-brand-dark-border/20 hover:bg-slate-50/50 dark:hover:bg-white/5">
                            <td className="p-3 font-extrabold">{p.name}</td>
                            <td className="p-3 text-slate-400 capitalize">{p.category}</td>
                            <td className="p-3 font-mono font-bold">{formatRs(p.price)}</td>
                            <td className="p-3 text-center">
                              <button onClick={() => toggleProductAvailability(p.id)} className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase cursor-pointer ${p.available ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'}`}>
                                {p.available ? 'In Stock' : 'Out'}
                              </button>
                            </td>
                            <td className="p-3 flex justify-center gap-1.5">
                              <button onClick={() => {
                                const newPrice = prompt(`New price for ${p.name}:`, String(p.price));
                                if (newPrice && !isNaN(Number(newPrice))) updateProductPrice(p.id, Number(newPrice));
                              }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300" title="Edit Price"><Edit2 size={10} /></button>
                              <button onClick={() => handleEditImage(p)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300" title="Edit Image"><Settings size={10} /></button>
                              <button onClick={() => handleDeleteProduct(p)} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded text-red-500" title="Delete"><Trash size={10} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Sales Reports */}
            {cashierTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Revenue Analytics</h4>
                  <button onClick={handleExportCSV} className="bg-brand-emerald hover:bg-brand-sage text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 cursor-pointer">
                    <FileText size={12} />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-brand-dark-card p-4 border border-slate-200/50 dark:border-brand-dark-border/40 rounded-2xl text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Period Revenue</span>
                    <p className="text-lg font-black text-brand-emerald dark:text-brand-amber mt-1">{formatRs(report.totalRevenue)}</p>
                  </div>
                  <div className="bg-white dark:bg-brand-dark-card p-4 border border-slate-200/50 dark:border-brand-dark-border/40 rounded-2xl text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Total Sales</span>
                    <p className="text-lg font-black text-slate-800 dark:text-white mt-1">{report.totalOrders}</p>
                  </div>
                  <div className="bg-white dark:bg-brand-dark-card p-4 border border-slate-200/50 dark:border-brand-dark-border/40 rounded-2xl text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Avg Order Value</span>
                    <p className="text-lg font-black text-slate-800 dark:text-white mt-1">{formatRs(report.averageOrderValue)}</p>
                  </div>
                </div>

                {/* Recharts Hourly Sales */}
                <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hourly distribution of sales</h5>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="hour" stroke="#94A3B8" fontSize={8} />
                        <YAxis stroke="#94A3B8" fontSize={8} />
                        <Tooltip contentStyle={{ fontSize: '10px' }} />
                        <Area type="monotone" dataKey="Orders" stroke="#2C5E43" fill="#E8F0EC" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Recharts Pie Chart */}
                  <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gateway Revenue</h5>
                    <div className="h-32 flex items-center justify-center">
                      {paymentPieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={paymentPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={48} paddingAngle={4} dataKey="value">
                              {paymentPieData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ fontSize: '9px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <span className="text-[10px] text-slate-400">No transactions recorded.</span>
                      )}
                    </div>
                  </div>

                  {/* Leaderboard */}
                  <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Popular Items</h5>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {report.popularItems.slice(0, 5).map((item, idx) => (
                        <div key={item.productId} className="flex justify-between items-center text-[10px]">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{idx + 1}. {item.name}</span>
                          <span className="font-bold text-brand-emerald dark:text-brand-amber">{item.quantity} sold</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Table QR Generator */}
            {cashierTab === 'qr' && (
              <div className="space-y-4">
                {/* Mobile scan information banner */}
                <div className="bg-brand-emerald/5 dark:bg-brand-amber/5 border border-brand-emerald/15 dark:border-brand-amber/15 rounded-2xl p-4 text-[10px] text-slate-500 dark:text-slate-400 text-left space-y-1">
                  <p className="font-extrabold text-brand-emerald dark:text-brand-amber uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode size={12} />
                    <span>Mobile Device Scanning Configuration</span>
                  </p>
                  <p>
                    By default, QR codes point to your browser address (<code className="bg-slate-100 dark:bg-white/10 px-1 rounded text-[9px] font-mono font-semibold">{window.location.origin}</code>).
                    To scan QR codes using a <strong>real mobile phone</strong>, verify your phone is on the same network, and set the URL below to your computer's <strong>local network IP address</strong> (e.g., <code className="bg-slate-100 dark:bg-white/10 px-1 rounded text-[9px] font-mono font-semibold">http://192.168.1.100:5173</code>).
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-50 dark:bg-brand-dark-bg/30 p-3.5 rounded-2xl border border-slate-100 dark:border-brand-dark-border/20">
                  {/* Table Count controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Table Count:</span>
                    <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-[11px] font-bold bg-white dark:bg-brand-dark-card">
                      <button onClick={() => setTableCount(c => Math.max(1, c - 1))} className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"><Minus size={10} /></button>
                      <span className="px-2 text-brand-emerald dark:text-brand-amber tabular-nums min-w-[3ch] text-center">{tableCount}</span>
                      <button onClick={() => setTableCount(c => Math.min(50, c + 1))} className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"><Plus size={10} /></button>
                    </div>
                  </div>

                  {/* QR Base URL Input */}
                  <div className="flex flex-1 items-center gap-2 max-w-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">QR Destination:</span>
                    <input
                      type="text"
                      value={qrBaseUrl}
                      onChange={(e) => setQrBaseUrl(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card rounded-xl outline-none text-xs text-left"
                      placeholder="http://192.168.x.x:5173"
                    />
                  </div>

                  <button onClick={() => navigate('/qr-tables')} className="flex items-center gap-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold text-[10px] px-3.5 py-2 rounded-xl shadow cursor-pointer whitespace-nowrap">
                    <Printer size={12} />
                    <span>View Printable Layout</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-1">
                  {Array.from({ length: tableCount }, (_, i) => String(i + 1)).map(t => (
                    <TableQRCard key={t} tableNumber={t} baseUrl={qrBaseUrl} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* RIGHT PANEL: KITCHEN DISPLAY SYSTEM */}
        {(layoutMode === 'split' || layoutMode === 'kitchen') && (
          <section className={`flex-1 flex flex-col min-h-0 bg-brand-mint/20 dark:bg-brand-dark-card/5 overflow-y-auto p-6 ${
            layoutMode === 'kitchen' ? 'w-full' : 'lg:w-1/2'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <ChefHat size={18} className="text-brand-amber animate-pulse" />
                <h2 className="text-base font-black text-brand-emerald dark:text-white uppercase tracking-wider">Kitchen Order Queue</h2>
              </div>

              {/* Kitchen Filters */}
              <div className="flex bg-slate-100 dark:bg-brand-dark-bg rounded-xl p-1 gap-1 border border-slate-200/50 dark:border-brand-dark-border/20">
                {[
                  { key: 'all', label: 'All', count: kitchenTickets.length },
                  { key: 'preparing', label: 'Preparing', count: preparingTickets.length },
                  { key: 'ready', label: 'Ready', count: readyTickets.length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setKitchenFilter(tab.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                      kitchenFilter === tab.key 
                        ? 'bg-white dark:bg-brand-dark-card text-brand-emerald dark:text-brand-amber shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Kitchen Quick Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Active Prep', val: preparingTickets.length, color: 'text-brand-amber' },
                { label: 'Ready serving', val: readyTickets.length, color: 'text-emerald-500' },
                { label: 'Total Items', val: preparingTickets.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0), color: 'text-slate-700 dark:text-white' },
                { label: 'Batch cooking', val: batchSummary.length, color: 'text-brand-emerald dark:text-brand-amber' }
              ].map(st => (
                <div key={st.label} className="bg-white dark:bg-brand-dark-card p-3 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/30 text-left">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{st.label}</span>
                  <p className={`text-lg font-black ${st.color} mt-0.5`}>{st.val}</p>
                </div>
              ))}
            </div>

            {/* Batch Aggregates Summary */}
            {batchSummary.length > 0 && (
              <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-4 border border-slate-200/50 dark:border-brand-dark-border/30 mb-6 text-left shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  <Coffee size={12} className="text-brand-amber" />
                  <span>Batch Cooking Aggregates (Co-Cooking)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {batchSummary.map(([itemName, totalQty]) => (
                    <div key={itemName} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-[11px] font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">{itemName}</span>
                      <span className="bg-brand-amber text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shrink-0">x{totalQty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kitchen Queue Alert Banner */}
            <AnimatePresence>
              {kitchenNewOrderAlert && (
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  className="bg-brand-amber text-brand-dark-bg font-black px-4 py-3 rounded-2xl shadow-lg border-2 border-brand-gold flex items-center justify-between mb-4 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <BellRing size={18} className="animate-bounce" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">New Order Received!</h4>
                      <p className="text-[9px] font-medium opacity-85">Check cooking tickets and customization notes.</p>
                    </div>
                  </div>
                  <button onClick={() => setKitchenNewOrderAlert(false)} className="text-[10px] font-black text-brand-dark-bg hover:underline cursor-pointer">Dismiss</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Kitchen Tickets Grid */}
            {displayedKitchenTickets.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-brand-dark-border/40">
                <ChefHat size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2 animate-pulse" />
                <p className="text-slate-400 text-xs font-semibold">No tickets in the kitchen. Waiting for orders...</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${layoutMode === 'kitchen' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {displayedKitchenTickets.map(ticket => {
                  const isPreparing = ticket.status === 'preparing';
                  const isReady = ticket.status === 'ready';
                  const isOvertime = isPreparing && (ticket.elapsedPrepTime || 0) > 600;

                  return (
                    <motion.div 
                      layout 
                      key={ticket.id} 
                      className={`rounded-2xl border text-left shadow-sm flex flex-col justify-between ${
                        isOvertime 
                          ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/10' 
                          : isReady 
                            ? 'border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-brand-dark-card' 
                            : 'border-brand-amber/30 bg-white dark:bg-brand-dark-card'
                      }`}
                    >
                      {/* Ticket Header */}
                      <div className={`p-3.5 flex justify-between items-center rounded-t-2xl ${
                        isOvertime 
                          ? 'bg-rose-500 text-white' 
                          : isReady 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-brand-amber/15 border-b border-brand-amber/20'
                      }`}>
                        <div>
                          <h3 className={`font-black text-xs tracking-wider ${isPreparing && !isOvertime ? 'text-brand-emerald dark:text-brand-amber' : 'text-white'}`}>Table #{ticket.tableNumber}</h3>
                          <span className={`text-[8px] font-mono opacity-80 block ${isPreparing && !isOvertime ? 'text-slate-400' : 'text-white'}`}>ID: {ticket.id}</span>
                        </div>
                        {isPreparing && (
                          <div className={`flex items-center gap-1 font-bold font-mono text-[10px] px-2 py-0.5 rounded-lg ${isOvertime ? 'bg-white text-rose-600 animate-pulse' : 'bg-brand-emerald/10 text-brand-emerald dark:bg-white/20 dark:text-white'}`}>
                            <Timer size={10} />
                            <span>{formatStopwatch(ticket.elapsedPrepTime)}</span>
                          </div>
                        )}
                      </div>

                      {/* Ticket Items */}
                      <div className="p-4 flex-1 space-y-3.5">
                        {ticket.items.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-black text-slate-800 dark:text-slate-200 leading-snug">{item.product.name}</span>
                              <span className="bg-brand-amber/10 text-brand-amber font-black text-[10px] px-1.5 py-0.5 rounded-md border border-brand-amber/20 shrink-0">x{item.quantity}</span>
                            </div>
                            {item.selectedCustomizations.length > 0 && (
                              <div className="pl-2 border-l-2 border-brand-amber/30 text-[9px] text-brand-amber font-semibold leading-relaxed">
                                {item.selectedCustomizations.map((c, cIdx) => (
                                  <div key={cIdx}>• {c.name}: {c.selections.map(s => s.name).join(', ')}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {ticket.notes && (
                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-[9px] text-slate-500 leading-normal">
                            <span className="font-bold text-brand-amber block mb-0.5">Note:</span>
                            {ticket.notes}
                          </div>
                        )}
                      </div>

                      {/* Ticket Footer Action */}
                      <div className="p-3.5 border-t border-slate-100 dark:border-brand-dark-border/30">
                        {isPreparing ? (
                          <button onClick={() => updateOrderStatus(ticket.id, 'ready')} className="w-full bg-brand-emerald hover:bg-brand-sage text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer">
                            <Check size={12} className="stroke-[3]" />
                            <span>Mark as Ready</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={14} />
                            <span className="text-xs font-bold">Ready to Serve</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ── ALERTS & MODALS (CASHIER TAB HELPER CONTAINERS) ── */}
      <AnimatePresence>
        {/* Accept Modal */}
        {showAcceptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAcceptModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-2">Accept Order</h4>
              <p className="text-xs text-slate-400 mb-4">Select the estimated preparation time (in minutes) for this order:</p>
              
              <div className="space-y-4">
                <div className="flex justify-between gap-2">
                  {[10, 15, 20, 30].map(mins => (
                    <button key={mins} onClick={() => setEstTimeInput(mins)} className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${estTimeInput === mins ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg' : 'bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200'}`}>
                      {mins} mins
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Custom Mins:</label>
                  <input type="number" value={estTimeInput} onChange={(e) => setEstTimeInput(Number(e.target.value))} className="w-20 px-3 py-1.5 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-lg text-xs" />
                </div>
                <div className="flex gap-2 border-t border-slate-100 dark:border-brand-dark-border/20 pt-4">
                  <button onClick={confirmAccept} className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Confirm Accept</button>
                  <button onClick={() => setShowAcceptModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider mb-2">Reject Order</h4>
              <p className="text-xs text-slate-400 mb-3">Provide a reason for rejecting this order:</p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="E.g., Out of ingredients / Coffee machine offline"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                />
                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-brand-dark-border/20">
                  <button onClick={confirmReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Confirm Reject</button>
                  <button onClick={() => setShowRejectModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddProductModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-4">Add Menu Item</h4>
              <form onSubmit={handleAddProductSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Item Name</label>
                    <input type="text" required value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder="E.g. Mint Spiced Tea" className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Price (Rs.)</label>
                    <input type="number" required value={newProdPrice} onChange={(e) => setNewProdPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                    <select value={newProdCat} onChange={(e) => setNewProdCat(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none">
                      <option value="tea">Tea</option>
                      <option value="coffee">Coffee</option>
                      <option value="cold-drinks">Cold Drinks</option>
                      <option value="snacks">Snacks</option>
                      <option value="sandwich">Sandwiches</option>
                      <option value="burger">Burgers</option>
                      <option value="pizza">Pizza</option>
                      <option value="bakery">Bakery</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Prep Time (mins)</label>
                    <input type="number" required value={newProdPrep} onChange={(e) => setNewProdPrep(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Description</label>
                  <input type="text" value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} placeholder="Description of item..." className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Image URL (Optional)</label>
                  <input type="text" value={newProdImg} onChange={(e) => setNewProdImg(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-brand-dark-border/20">
                  <button type="submit" className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Save Item</button>
                  <button type="button" onClick={() => setShowAddProductModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Image Modal */}
        {showEditImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditImageModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-4">Edit Product Image</h4>
              <p className="text-xs text-slate-400 mb-3">Product: <span className="font-bold text-slate-800 dark:text-white">{editingProductName}</span></p>
              
              <form onSubmit={handleEditImageSubmit} className="space-y-3">
                <input type="text" value={editImageURL} onChange={(e) => setEditImageURL(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-brand-dark-border/20">
                  <button type="submit" className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Update</button>
                  <button type="button" onClick={() => setShowEditImageModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Product Confirmation Modal */}
        {showDeleteConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirmModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider mb-2">Delete Product</h4>
              <p className="text-xs text-slate-400 mb-4">Delete <span className="font-bold text-slate-800 dark:text-white">{deletingProductName}</span>? This action is permanent.</p>
              <div className="flex gap-2">
                <button onClick={confirmDeleteProduct} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Delete</button>
                <button onClick={() => setShowDeleteConfirmModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden print invoice container */}
      <ReceiptPDF order={activeReceiptOrder} elementId="cashier-receipt-container" />

    </div>
  );
};

export default SplitDashboard;
