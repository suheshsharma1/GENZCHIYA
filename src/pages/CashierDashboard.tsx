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
  Bell, LayoutGrid, List, ChefHat, Timer, BellRing
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, Product, OrderStatus } from '../types';
import { ReceiptPDF } from '../components/ReceiptPDF';
import { downloadReceiptPDF } from '../utils/pdf';
import { SVGLogo } from '../components/SVGLogo';

export const CashierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    orders, products, activeTable, updateOrderStatus, toggleProductAvailability, 
    updateProductPrice, updateProductImage, deleteProduct, addProduct, getSalesReport, resetAllData, logoutStaff 
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'menu' | 'reports' | 'kitchen'>('orders');

  // Notification state
  const [showNewOrderPopup, setShowNewOrderPopup] = useState(false);
  const [newOrderPopupData, setNewOrderPopupData] = useState<Order | null>(null);
  const prevPendingCountRef = useRef(0);

  // Local helper states
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Est time prompt states
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptOrderId, setAcceptOrderId] = useState('');
  const [estTimeInput, setEstTimeInput] = useState(15);
  
  // Menu layout toggle mode
  const [menuViewMode, setMenuViewMode] = useState<'grid' | 'table'>('grid');

  // Menu editor states
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  // New Product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(150);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCat, setNewProdCat] = useState('tea');
  const [newProdImg, setNewProdImg] = useState('');
  const [newProdPrep, setNewProdPrep] = useState(5);
  const [newProdImageFile, setNewProdImageFile] = useState<File | null>(null);

  // Edit image form state
  const [editingProductId, setEditingProductId] = useState('');
  const [editingProductName, setEditingProductName] = useState('');
  const [editImageURL, setEditImageURL] = useState('');
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  // Delete confirmation state
  const [deletingProductId, setDeletingProductId] = useState('');
  const [deletingProductName, setDeletingProductName] = useState('');

  // Report search states
  const [reportSearch, setReportSearch] = useState('');

  // Kitchen view state
  const [filterStatus, setFilterStatus] = useState<'all' | 'preparing' | 'ready'>('all');
  const [kitchenNewOrderAlert, setKitchenNewOrderAlert] = useState(false);
  const [kitchenLastOrderCount, setKitchenLastOrderCount] = useState(0);

  // Live order sections
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending'), [orders]);
  const activeOrders = useMemo(() => orders.filter(o => ['preparing', 'ready'].includes(o.status)), [orders]);

  // Kitchen ticket sections
  const kitchenTickets = useMemo(() => {
    return orders
      .filter(o => ['preparing', 'ready'].includes(o.status))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [orders]);

  const preparingTickets = useMemo(() => kitchenTickets.filter(o => o.status === 'preparing'), [kitchenTickets]);
  const readyTickets = useMemo(() => kitchenTickets.filter(o => o.status === 'ready'), [kitchenTickets]);

  const displayedTickets = useMemo(() => {
    if (filterStatus === 'preparing') return preparingTickets;
    if (filterStatus === 'ready') return readyTickets;
    return kitchenTickets;
  }, [filterStatus, preparingTickets, readyTickets, kitchenTickets]);

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

  const formatStopwatch = (totalSeconds?: number) => {
    if (totalSeconds === undefined) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Notification popup for new pending orders
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

  // Kitchen alert on new preparing orders
  useEffect(() => {
    const incomingCount = orders.filter(o => o.status === 'preparing').length;
    if (incomingCount > kitchenLastOrderCount) {
      setKitchenNewOrderAlert(true);
      const t = setTimeout(() => setKitchenNewOrderAlert(false), 4000);
      return () => clearTimeout(t);
    }
    setKitchenLastOrderCount(incomingCount);
  }, [orders, kitchenLastOrderCount]);

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

  const closeNewOrderPopup = () => {
    setShowNewOrderPopup(false);
    setNewOrderPopupData(null);
  };

  // Logout Handler
  const handleLogout = () => {
    logoutStaff();
    navigate('/login');
  };

  // Pricing format
  const formatRs = (num: number) => `Rs. ${num.toLocaleString()}`;

  // Accept Order Handler
  const handleAcceptOrder = (orderId: string) => {
    setAcceptOrderId(orderId);
    setEstTimeInput(15); // default
    setShowAcceptModal(true);
  };

  const confirmAccept = () => {
    updateOrderStatus(acceptOrderId, 'preparing', { estTime: estTimeInput });
    setShowAcceptModal(false);
  };

  // Reject Order Handler
  const handleRejectOrder = (orderId: string) => {
    setRejectOrderId(orderId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    updateOrderStatus(rejectOrderId, 'rejected', { rejectionReason });
    setShowRejectModal(false);
  };

  // Kitchen print trigger
  const handlePrintReceipt = async (order: Order) => {
    setActiveReceiptOrder(order);
    // Let the DOM update
    setTimeout(async () => {
      await downloadReceiptPDF('cashier-receipt-container', `receipt_${order.id}.pdf`);
    }, 100);
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    // Use uploaded image or URL or placeholder
    const imgUrl = newProdImg.trim() || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80";

    addProduct({
      name: newProdName,
      price: Number(newProdPrice),
      description: newProdDesc,
      category: newProdCat,
      image: imgUrl,
      preparationTime: Number(newProdPrep)
    });

    // Reset fields
    setNewProdName('');
    setNewProdPrice(150);
    setNewProdDesc('');
    setNewProdImg('');
    setNewProdPrep(5);
    setNewProdImageFile(null);
    setShowAddProductModal(false);
  };

  const handleNewProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProdImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProdImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Edit Image Handlers
  const handleEditImage = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProductName(product.name);
    setEditImageURL(product.image);
    setUploadedImageFile(null);
    setShowEditImageModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImageURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;

    updateProductImage(editingProductId, editImageURL.trim());
    setShowEditImageModal(false);
    setEditingProductId('');
    setEditingProductName('');
    setEditImageURL('');
    setUploadedImageFile(null);
  };

  // Delete Product Handlers
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
      setDeletingProductName('');
    }
  };

  // CSV Report Generator
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

  // Sales data analytics calculation
  const report = getSalesReport();

  // Recharts Line Chart for hourly distribution
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

  // Recharts Bar Chart for category sales
  const categoryData = useMemo(() => {
    return Object.entries(report.revenueByCategory).map(([cat, rev]) => ({
      name: cat.toUpperCase(),
      Revenue: rev
    }));
  }, [report]);

  // Recharts Pie Chart for Payment distribution
  const paymentPieData = useMemo(() => {
    return [
      { name: 'Khalti', value: report.revenueByPaymentMethod.khalti },
      { name: 'Esewa', value: report.revenueByPaymentMethod.esewa },
      { name: 'Cash', value: report.revenueByPaymentMethod.cash }
    ].filter(p => p.value > 0);
  }, [report]);

  const COLORS = ['#5C2D91', '#2C5E43', '#D4A373'];

  // Filter products for Menu Tab
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(menuSearch.toLowerCase());
      const matchCat = menuFilterCategory === 'all' || p.category === menuFilterCategory;
      return matchSearch && matchCat;
    });
  }, [products, menuSearch, menuFilterCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark-bg text-slate-800 dark:text-slate-100 flex flex-col md:flex-row">
      
      {/* 1. Sidebar Nav */}
      <aside className="w-full md:w-64 bg-white dark:bg-brand-dark-card border-b md:border-r border-slate-200 dark:border-brand-dark-border flex flex-col justify-between shrink-0 p-5">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <SVGLogo size={34} />
            <button 
              onClick={resetAllData}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-dark-bg transition-colors"
              title="Reset System Database"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg shadow'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-dark-bg'
              }`}
            >
              <ShoppingBag size={16} />
              <span>Live Queue</span>
              {pendingOrders.length > 0 && (
                <span className="ml-auto bg-rose-500 text-white font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg shadow'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-dark-bg'
              }`}
            >
              <BarChart2 size={16} />
              <span>Analytics Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg shadow'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-dark-bg'
              }`}
            >
              <Coffee size={16} />
              <span>Menu Management</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg shadow'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-dark-bg'
              }`}
            >
              <FileText size={16} />
              <span>Sales Reports</span>
            </button>

            <button
              onClick={() => navigate('/qr-tables')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-dark-bg transition-all cursor-pointer"
            >
              <Settings size={16} />
              <span>Generate QRs</span>
            </button>
          </div>
        </div>

        {/* Staff details footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-brand-dark-border/40 mt-6 space-y-3">
          <div className="text-left">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Terminal</span>
            <span className="text-xs font-extrabold text-brand-emerald dark:text-brand-amber flex items-center gap-1.5 mt-0.5">
              Cashier Console #1
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetAllData}
              className="hidden md:flex flex-1 items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-brand-dark-border hover:bg-slate-100 dark:hover:bg-brand-dark-bg transition-all cursor-pointer text-slate-400"
              title="Reset System Database"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* TAB 1: Live Orders Queue */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Top Stat Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Orders</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                  {orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length}
                </h3>
              </div>
              <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
                <h3 className="text-2xl font-black text-rose-500 mt-1">{pendingOrders.length}</h3>
              </div>
              <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Preparations</span>
                <h3 className="text-2xl font-black text-amber-500 mt-1">
                  {orders.filter(o => o.status === 'preparing').length}
                </h3>
              </div>
              <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kitchen Ready</span>
                <h3 className="text-2xl font-black text-emerald-500 mt-1">
                  {orders.filter(o => o.status === 'ready').length}
                </h3>
              </div>
            </div>

            {/* Pending incoming section */}
            {pendingOrders.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 text-left">
                  <AlertCircle size={16} className="animate-pulse" />
                  <span>Incoming Orders Needs Confirmation</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingOrders.map(order => (
                    <motion.div
                      layout
                      key={order.id}
                      className="bg-rose-50/20 dark:bg-rose-950/5 border-2 border-rose-500/20 dark:border-rose-500/10 rounded-2xl p-4 text-left flex flex-col justify-between space-y-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold font-mono text-rose-600 dark:text-rose-400">ID: {order.id}</span>
                          <span className="bg-brand-emerald/10 text-brand-emerald dark:bg-brand-amber/15 dark:text-brand-amber font-black text-[10px] px-2.5 py-1 rounded-lg">
                            Table #{order.tableNumber}
                          </span>
                        </div>
                        
                        <div className="text-xs font-extrabold">
                          {order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}
                        </div>

                        {order.notes && (
                          <p className="text-[10px] text-slate-400 font-medium">Guest Note: {order.notes}</p>
                        )}
                        <p className="text-[10px] text-slate-400">Total Bill: <span className="font-extrabold text-slate-800 dark:text-white">{formatRs(order.total)}</span> | {order.payment.method.toUpperCase()}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check size={14} />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Kitchen preparations tracker */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 text-left">Active Orders Queue</h4>

              {activeOrders.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-brand-dark-border/40">
                  <CheckCircle2 size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-slate-400 text-xs font-semibold">No active preparations. Standing by...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeOrders.map(order => (
                    <motion.div
                      layout
                      key={order.id}
                      className="bg-white dark:bg-brand-dark-card rounded-2xl p-4 border border-slate-200/60 dark:border-brand-dark-border/50 text-left flex flex-col justify-between space-y-4 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold font-mono text-slate-400">ID: {order.id}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            order.status === 'ready' 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : 'bg-amber-500/10 text-amber-500 animate-pulse' 
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="flex justify-between items-start pt-1.5">
                          <h4 className="font-extrabold text-xs">Table #{order.tableNumber}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{order.customerName}</span>
                        </div>

                        <div className="text-xs font-extrabold border-t border-slate-100 dark:border-brand-dark-border/20 pt-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>• {item.product.name} x{item.quantity}</span>
                              {item.selectedCustomizations.length > 0 && (
                                <span className="text-[10px] text-slate-400 font-normal">
                                  {item.selectedCustomizations.map(c => c.selections.map(s => s.name).join(', ')).join(' | ')}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                       <div className="flex gap-1.5 border-t border-slate-100 dark:border-brand-dark-border/20 pt-3">
                         <button
                           onClick={() => handlePrintReceipt(order)}
                           className="p-2 bg-slate-100 dark:bg-brand-dark-bg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                           title="Print Receipt"
                         >
                           <Printer size={14} />
                         </button>
                         
                         {order.status === 'preparing' && (
                           <button
                             onClick={() => updateOrderStatus(order.id, 'ready')}
                             className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                           >
                             Mark Ready
                           </button>
                         )}
                         {order.status === 'ready' && (
                           <button
                             onClick={() => updateOrderStatus(order.id, 'served')}
                             className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-lg text-[10px] transition-colors cursor-pointer"
                           >
                             Mark Served
                           </button>
                         )}
                       </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: Kitchen Queue */}
        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            
            {/* Kitchen Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-amber/10 rounded-xl">
                  <ChefHat size={22} className="text-brand-amber" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-brand-emerald dark:text-white">Kitchen Order Queue</h2>
                  <p className="text-[10px] text-slate-500 font-medium">Real-time ticket management & preparation tracking</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-xl p-1 gap-1">
                  {[
                    { key: 'all', label: 'All', count: kitchenTickets.length },
                    { key: 'preparing', label: 'Preparing', count: preparingTickets.length },
                    { key: 'ready', label: 'Ready', count: readyTickets.length }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setFilterStatus(tab.key as any)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        filterStatus === tab.key
                          ? 'bg-white dark:bg-brand-dark-bg text-brand-emerald dark:text-brand-amber shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">LIVE</span>
                </div>
              </div>
            </div>

            {/* Kitchen Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Prep</span>
                <h3 className="text-2xl font-black text-brand-amber mt-1">{preparingTickets.length}</h3>
              </div>
              <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready</span>
                <h3 className="text-2xl font-black text-emerald-500 mt-1">{readyTickets.length}</h3>
              </div>
              <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items in Queue</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                  {preparingTickets.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0)}
                </h3>
              </div>
              <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Batch Items</span>
                <h3 className="text-2xl font-black text-brand-emerald dark:text-brand-amber mt-1">{batchSummary.length}</h3>
              </div>
            </div>

            {/* Batch Cooking Summary */}
            {batchSummary.length > 0 && (
              <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                  <Coffee size={14} />
                  <span>Batch Cooking Aggregates</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {batchSummary.slice(0, 8).map(([itemName, totalQty]) => (
                    <div 
                      key={itemName}
                      className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/30"
                    >
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-snug pr-3">{itemName}</span>
                      <span className="bg-brand-amber text-white font-black text-[10px] min-w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        x{totalQty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Order Alert Banner */}
            <AnimatePresence>
              {kitchenNewOrderAlert && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="bg-brand-amber text-brand-dark-bg font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-brand-gold"
                >
                  <div className="flex items-center gap-3">
                    <BellRing size={24} className="animate-bounce" />
                    <div className="text-left">
                      <h4 className="text-sm font-black tracking-wide uppercase">New Order Dispatched to Kitchen!</h4>
                      <p className="text-xs font-medium opacity-80">Check table numbers and prep times below.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setKitchenNewOrderAlert(false)}
                    className="text-brand-dark-bg/80 hover:text-brand-dark-bg font-bold text-xs"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Kitchen Tickets Grid */}
            {displayedTickets.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-brand-dark-border/40">
                <CheckCircle2 size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-slate-400 text-xs font-semibold">No orders in queue. Standing by...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayedTickets.map((ticket) => {
                  const isPreparing = ticket.status === 'preparing';
                  const isReady = ticket.status === 'ready';
                  const isOvertime = isPreparing && (ticket.elapsedPrepTime || 0) > 600;
                  
                  return (
                    <motion.div
                      layout
                      key={ticket.id}
                      className={`rounded-2xl border flex flex-col text-left shadow-sm hover:shadow-md transition-shadow ${
                        isOvertime 
                          ? 'border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/10' 
                          : isReady
                            ? 'border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-brand-dark-card'
                            : 'border-brand-amber/30 bg-white dark:bg-brand-dark-card'
                      }`}
                    >
                      {/* Header */}
                      <div className={`p-4 flex justify-between items-center ${
                        isOvertime
                          ? 'bg-rose-500 text-white rounded-t-2xl'
                          : isReady
                            ? 'bg-emerald-500 text-white rounded-t-2xl'
                            : 'bg-brand-amber/15 border-b border-brand-amber/20'
                      }`}>
                        <div>
                          <h3 className="font-black text-sm tracking-wide text-white">
                            Table #{ticket.tableNumber}
                          </h3>
                          <span className="text-[10px] font-mono opacity-70 text-white">ID: {ticket.id}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPreparing && (
                            <div className={`flex items-center gap-1.5 font-bold font-mono text-xs px-2.5 py-1 rounded-lg ${
                              isOvertime ? 'bg-white text-rose-600 animate-pulse' : 'bg-white/20 text-white'
                            }`}>
                              <Timer size={12} />
                              <span>{formatStopwatch(ticket.elapsedPrepTime)}</span>
                            </div>
                          )}
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isReady ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex-1 space-y-3">
                        {ticket.items.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.product.name}</span>
                              <span className="bg-brand-amber/10 text-brand-amber font-black text-[11px] px-2 py-0.5 rounded-md border border-brand-amber/20">
                                x{item.quantity}
                              </span>
                            </div>
                            {item.selectedCustomizations.length > 0 && (
                              <div className="pl-2 border-l-2 border-brand-amber/30 text-[10px] text-brand-amber font-semibold leading-relaxed">
                                {item.selectedCustomizations.map((c, cIdx) => (
                                  <div key={cIdx}>• {c.name}: {c.selections.map(s => s.name).join(', ')}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {ticket.notes && (
                          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-[10px] text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-brand-amber block mb-0.5">Note:</span>
                            {ticket.notes}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-4 border-t border-slate-100 dark:border-brand-dark-border/40">
                        {isPreparing && (
                          <button
                            onClick={() => updateOrderStatus(ticket.id, 'ready')}
                            className="w-full bg-brand-emerald hover:bg-brand-sage text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Check size={14} className="stroke-[3]" />
                            <span>Mark as Ready</span>
                          </button>
                        )}
                        {isReady && (
                          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={18} />
                            <span className="text-xs font-bold">Ready for Serving</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Sales Analytics Charts */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Analytics Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Period Sales</span>
                  <h3 className="text-3xl font-black text-brand-emerald dark:text-brand-amber mt-1">
                    {formatRs(report.totalRevenue)}
                  </h3>
                  <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-0.5">
                    <TrendingUp size={12} />
                    <span>+12% relative to last week</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 dark:bg-brand-dark-bg rounded-xl flex items-center justify-center text-brand-emerald dark:text-brand-amber">
                  <DollarSign size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Orders</span>
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                    {report.totalOrders}
                  </h3>
                  <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-0.5">
                    <TrendingUp size={12} />
                    <span>Avg ticket size: {formatRs(report.averageOrderValue)}</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 dark:bg-brand-dark-bg rounded-xl flex items-center justify-center text-brand-emerald dark:text-brand-amber">
                  <ShoppingBag size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Khalti Wallet Sales Share</span>
                  <h3 className="text-3xl font-black text-[#5C2D91] mt-1">
                    {formatRs(report.revenueByPaymentMethod.khalti)}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Esewa: {formatRs(report.revenueByPaymentMethod.esewa)} | Cash: {formatRs(report.revenueByPaymentMethod.cash)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 dark:bg-brand-dark-bg rounded-xl flex items-center justify-center text-[#5C2D91]">
                  <Layers size={24} />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Daily Sales Bar Chart */}
              <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 text-left">Hourly Order Counts</h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData}>
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2C5E43" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#2C5E43" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="Orders" stroke="#2C5E43" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Revenue Bar Chart */}
              <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 text-left">Category Revenue Share</h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                      <Bar dataKey="Revenue" fill="#D4A373" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Method Pie Chart */}
              <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 flex flex-col justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 text-left">Revenue by Payment Gateway</h4>
                <div className="h-60 flex items-center justify-center">
                  {paymentPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-xs text-slate-400">No payment data recorded.</span>
                  )}
                </div>
                <div className="flex justify-center gap-6 text-[10px] font-bold">
                  {paymentPieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{entry.name}: {formatRs(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Products Leaderboard */}
              <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 text-left">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Popular Delicacies Leaderboard</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {report.popularItems.map((item, idx) => (
                    <div key={item.productId} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-brand-dark-bg text-slate-500 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-brand-emerald dark:text-brand-amber block">{formatRs(item.revenue)}</span>
                        <span className="text-[9px] text-slate-400">{item.quantity} sold</span>
                      </div>
                    </div>
                  ))}
                  {report.popularItems.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-8">No transaction data logged.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: Menu Editor & Inventory */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
              <div className="flex gap-2 w-full md:max-w-md">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card rounded-xl outline-none text-xs"
                  />
                </div>
                
                <select
                  value={menuFilterCategory}
                  onChange={(e) => setMenuFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card rounded-xl outline-none text-xs"
                >
                  <option value="all">All Categories</option>
                  <option value="tea">Tea</option>
                  <option value="coffee">Coffee</option>
                  <option value="cold-drinks">Cold Drinks</option>
                  <option value="snacks">Snacks</option>
                  <option value="sandwich">Sandwiches</option>
                  <option value="burger">Burgers</option>
                  <option value="pizza">Pizza</option>
                  <option value="noodles">Noodles</option>
                  <option value="pasta">Pasta</option>
                  <option value="bakery">Bakery & Desserts</option>
                  <option value="breakfast">Breakfast</option>
                </select>
              </div>

              <div className="flex gap-2 items-center ml-auto">
                <div className="bg-slate-100 dark:bg-brand-dark-bg p-1 rounded-xl flex gap-1 border border-slate-200/40 dark:border-brand-dark-border/20">
                  <button
                    onClick={() => setMenuViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      menuViewMode === 'grid'
                        ? 'bg-white dark:bg-brand-dark-card text-brand-emerald dark:text-brand-amber shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    onClick={() => setMenuViewMode('table')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      menuViewMode === 'table'
                        ? 'bg-white dark:bg-brand-dark-card text-brand-emerald dark:text-brand-amber shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title="Table List View"
                  >
                    <List size={14} />
                  </button>
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-brand-emerald hover:bg-brand-sage text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Menu Items Rendering (Grid or Table) */}
            {menuViewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className="bg-white dark:bg-brand-dark-card rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 flex flex-col justify-between group hover:shadow-md transition-all text-left"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100 border-b border-slate-100 dark:border-brand-dark-border/30">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Category Tag */}
                      <span className="absolute top-3 left-3 bg-brand-emerald text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-extrabold text-slate-800 dark:text-white text-sm line-clamp-1">{p.name}</h4>
                          <span className="font-extrabold text-brand-emerald dark:text-brand-amber text-xs shrink-0">
                            {formatRs(p.price)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 h-7">{p.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-brand-dark-border/20">
                        <span className="text-[10px] font-semibold text-slate-400">Prep: {p.preparationTime}m</span>
                        
                        <button
                          onClick={() => toggleProductAvailability(p.id)}
                          className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase cursor-pointer transition-colors ${
                            p.available
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 hover:bg-emerald-100/50'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 hover:bg-red-100/50'
                          }`}
                        >
                          {p.available ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </div>

                      <div className="flex gap-1.5 pt-2">
                        <button
                          onClick={() => {
                            const newPrice = prompt(`Enter new price for ${p.name}:`, String(p.price));
                            if (newPrice && !isNaN(Number(newPrice))) {
                              updateProductPrice(p.id, Number(newPrice));
                            }
                          }}
                          className="flex-1 py-2 px-2.5 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-brand-dark-bg/40 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit2 size={10} />
                          <span>Edit Price</span>
                        </button>
                        <button
                          onClick={() => handleEditImage(p)}
                          className="py-2 px-2.5 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-brand-dark-bg/40 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                          title="Edit Image"
                        >
                          <Settings size={10} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="py-2 px-2.5 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-[10px] font-bold text-red-500 flex items-center justify-center transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-400">No items found matching searches.</div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-brand-dark-bg text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-brand-dark-border/40">
                      <tr>
                        <th className="p-4">Item Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Prep (min)</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-brand-dark-border/30">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-brand-dark-bg/20 transition-colors">
                          <td className="p-4 flex items-center gap-4">
                            <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-xl shadow-md border border-slate-100 dark:border-brand-dark-border/40 bg-slate-100" />
                            <div>
                              <span className="font-bold text-slate-800 dark:text-white block text-sm">{p.name}</span>
                              <span className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{p.description}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-slate-500 uppercase">{p.category}</td>
                          <td className="p-4 font-extrabold text-brand-emerald dark:text-brand-amber">
                            {formatRs(p.price)}
                          </td>
                          <td className="p-4 font-semibold">{p.preparationTime}m</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleProductAvailability(p.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                                p.available
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                                  : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                              }`}
                            >
                              {p.available ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => {
                                  const newPrice = prompt(`Enter new price for ${p.name}:`, String(p.price));
                                  if (newPrice && !isNaN(Number(newPrice))) {
                                    updateProductPrice(p.id, Number(newPrice));
                                  }
                                }}
                                className="p-1.5 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-100 dark:hover:bg-brand-dark-bg rounded-lg transition-colors cursor-pointer"
                                title="Edit Price"
                              >
                                <Edit2 size={12} className="text-slate-400 hover:text-slate-600" />
                              </button>
                              <button
                                onClick={() => handleEditImage(p)}
                                className="p-1.5 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-100 dark:hover:bg-brand-dark-bg rounded-lg transition-colors cursor-pointer"
                                title="Edit Image"
                              >
                                <Settings size={12} className="text-slate-400 hover:text-slate-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash size={12} className="text-red-400 hover:text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400">No items found matching searches.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: Reports & Logs */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            
            {/* Header controls */}
            <div className="flex flex-col md:flex-row justify-between gap-3 text-left">
              <div>
                <h3 className="text-xl font-bold font-brand-serif">Transaction History Audit Log</h3>
                <p className="text-xs text-slate-400 mt-1">Review all orders. Export data fields to spreadsheets.</p>
              </div>

              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={reportSearch}
                    onChange={(e) => setReportSearch(e.target.value)}
                    placeholder="Search logs by ID, Guest..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card rounded-xl outline-none text-xs"
                  />
                </div>
                <button
                  onClick={handleExportCSV}
                  className="bg-brand-emerald hover:bg-brand-sage text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText size={14} />
                  <span>Export CSV Log</span>
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-slate-200/50 dark:border-brand-dark-border/40 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-brand-dark-bg text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-brand-dark-border/40">
                    <tr>
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Date/Time</th>
                      <th className="p-4">Table</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Total Price</th>
                      <th className="p-4">Gateway</th>
                      <th className="p-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-brand-dark-border/30">
                    {orders
                      .filter(o => o.id.toLowerCase().includes(reportSearch.toLowerCase()) || o.customerName.toLowerCase().includes(reportSearch.toLowerCase()))
                      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-brand-dark-bg/20 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-800 dark:text-white">{o.id}</td>
                          <td className="p-4 text-slate-500">
                            {new Date(o.createdAt).toLocaleString()}
                          </td>
                          <td className="p-4 font-bold">#{o.tableNumber}</td>
                          <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">{o.customerName}</td>
                          <td className="p-4 font-extrabold text-brand-emerald dark:text-brand-amber">
                            {formatRs(o.total)}
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              o.payment.method === 'khalti' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400' : 'bg-slate-100 text-slate-800 dark:bg-brand-dark-bg dark:text-slate-400'
                            }`}>
                              {o.payment.method}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handlePrintReceipt(o)}
                              className="p-1.5 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-100 dark:hover:bg-brand-dark-bg rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              title="Download PDF"
                            >
                              <Printer size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* New Order Popup Notification */}
      <AnimatePresence>
        {showNewOrderPopup && newOrderPopupData && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-4 right-4 z-[60] w-full max-w-sm"
          >
            <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-2xl border-2 border-rose-500/30 dark:border-rose-500/20 text-slate-800 dark:text-white">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500/10 rounded-xl shrink-0">
                  <Bell size={24} className="text-rose-500 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-rose-500 uppercase tracking-wider text-left">New Order Received</h4>
                  <p className="text-xs text-slate-400 mt-1 text-left">Table #{newOrderPopupData.tableNumber} • {newOrderPopupData.customerName}</p>
                  <p className="text-xs font-extrabold mt-1 text-left truncate">
                    {newOrderPopupData.items.map(item => `${item.product.name} x${item.quantity}`).join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 text-left">Total: {formatRs(newOrderPopupData.total)}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    closeNewOrderPopup();
                    handleAcceptOrder(newOrderPopupData.id);
                  }}
                  className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Check size={14} />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => {
                    closeNewOrderPopup();
                    handleRejectOrder(newOrderPopupData.id);
                  }}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <X size={14} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A. Rejection Overlay Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
            <div className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-2xl z-10 border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider mb-2 text-left">Reject Order ticket</h4>
              <p className="text-xs text-slate-400 mb-4 text-left">Provide a brief rejection explanation for the customer status page.</p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="E.g., Kitchen too busy, Items Sold Out..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-red-500"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={confirmReject}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer disabled:opacity-50"
                  >
                    Confirm Reject
                  </button>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 hover:text-slate-700 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* B. Accept Timing Modal */}
      <AnimatePresence>
        {showAcceptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAcceptModal(false)} />
            <div className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-2xl z-10 border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-2 text-left">Set Estimated Cook Time</h4>
              <p className="text-xs text-slate-400 mb-4 text-left">Input approximate time required by kitchen in minutes.</p>
              
              <div className="space-y-3">
                <div className="flex gap-2 items-center justify-center bg-slate-50 dark:bg-brand-dark-bg/60 border border-slate-100 dark:border-brand-dark-border/40 py-2 rounded-xl">
                  <button 
                    onClick={() => setEstTimeInput(prev => Math.max(5, prev - 5))}
                    className="p-1 font-bold text-lg text-slate-400 hover:text-slate-800"
                  >
                    -
                  </button>
                  <span className="font-black text-base text-brand-emerald dark:text-brand-amber font-mono w-14 text-center">{estTimeInput} mins</span>
                  <button 
                    onClick={() => setEstTimeInput(prev => prev + 5)}
                    className="p-1 font-bold text-lg text-slate-400 hover:text-slate-800"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={confirmAccept}
                    className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Accept Order Ticket
                  </button>
                  <button
                    onClick={() => setShowAcceptModal(false)}
                    className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 hover:text-slate-700 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* C. Add Product Modal */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddProductModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-md bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white"
            >
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-4">Add Menu Item</h4>
              
              <form onSubmit={handleAddProductSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="E.g., Saffron Milk Tea"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Prep Time (min)</label>
                    <input
                      type="number"
                      required
                      value={newProdPrep}
                      onChange={(e) => setNewProdPrep(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card rounded-xl text-xs outline-none focus:border-brand-sage"
                  >
                    <option value="tea">Tea</option>
                    <option value="coffee">Coffee</option>
                    <option value="cold-drinks">Cold Drinks</option>
                    <option value="snacks">Snacks</option>
                    <option value="sandwich">Sandwiches</option>
                    <option value="burger">Burgers</option>
                    <option value="pizza">Pizza</option>
                    <option value="noodles">Noodles</option>
                    <option value="pasta">Pasta</option>
                    <option value="bakery">Bakery & Desserts</option>
                    <option value="breakfast">Breakfast</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Upload Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewProductFileUpload}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Or Enter Image URL</label>
                  <input
                    type="text"
                    value={newProdImg}
                    onChange={(e) => setNewProdImg(e.target.value)}
                    placeholder="Leave empty for default cafe imagery"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <textarea
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    rows={2}
                    placeholder="Short details for digital menu..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    Save Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 hover:text-slate-700 py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Edit Image Modal */}
      <AnimatePresence>
        {showEditImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditImageModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-md bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white"
            >
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-4">Edit Product Image</h4>
              
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-2">Product: <span className="font-bold text-slate-800 dark:text-white">{editingProductName}</span></p>
                <div className="relative w-full h-40 bg-slate-100 dark:bg-brand-dark-bg rounded-xl overflow-hidden mb-3">
                  <img 
                    src={editImageURL} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
              </div>

              <form onSubmit={handleEditImageSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Upload Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Or Enter Image URL</label>
                  <input
                    type="text"
                    value={editImageURL}
                    onChange={(e) => setEditImageURL(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    Update Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditImageModal(false)}
                    className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 hover:text-slate-700 py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. Delete Product Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirmModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white"
            >
              <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider mb-2">Delete Product</h4>
              <p className="text-xs text-slate-400 mb-4">
                Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-white">{deletingProductName}</span>? This action cannot be undone.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={confirmDeleteProduct}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Delete Product
                </button>
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 hover:text-slate-700 py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden print container for cashier thermal print generation */}
      <ReceiptPDF order={activeReceiptOrder} elementId="cashier-receipt-container" />

    </div>
  );
};
export default CashierDashboard;
