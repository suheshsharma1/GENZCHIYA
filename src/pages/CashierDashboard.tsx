import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShoppingBag, Users, DollarSign, Check, X, Printer, TrendingUp, 
  TrendingDown, Plus, LogOut, RefreshCw, BarChart2, Coffee, 
  Layers, FileText, CheckCircle2, AlertCircle, Trash, Search, Upload, Edit2,
  Bell, LayoutGrid, List, Timer, QrCode, Download, Minus, Clock,
  Folder, FolderOpen, ChevronDown, ChevronRight, Tag, Sparkles, Star, Unlock
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { Order, Product } from '../types';
import { ReceiptPDF } from '../components/ReceiptPDF';
import { downloadReceiptPDF } from '../utils/pdf';
import { SVGLogo } from '../components/SVGLogo';
import { PaymentSummaryPanel } from '../components/PaymentSummaryPanel';
import { TableCard } from '../components/TableCard';

/* ─── Table QR Card Component ──────────────────────────────── */
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
        <div className="mb-2">
          <SVGLogo variant="full" size={32} />
        </div>

        <div className="w-12 h-px bg-brand-amber/40 mb-3" />

        <p className="text-[9px] font-extrabold tracking-[0.25em] text-brand-amber uppercase mb-0.5">
          Table Number
        </p>

        <h2
          className="text-4xl font-black text-brand-emerald leading-none mb-3"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          #{tableNumber}
        </h2>

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

        <p className="text-[9px] font-black tracking-[0.2em] text-brand-emerald uppercase mb-1">
          Scan to Order
        </p>
        <p className="text-[8px] text-slate-400 leading-relaxed max-w-[170px] mb-3">
          Scan this code using your phone camera to browse the digital menu and place your order instantly.
        </p>

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

/* ─── Cashier Dashboard Component ─────────────────────────────────────────── */
export const CashierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    orders, orderHistory, products, categories, reviews, updateProductImage,
    updateProduct, deleteProduct, deleteProducts, addProduct,
    updateOrderStatus, toggleProductAvailability,
    addCategory, renameCategory, deleteCategory, moveProductsToCategory,
    getSalesReport, clearPaymentHistory, logoutStaff,
    deleteReview,
    totalTables, setTotalTables, getTableStatus, getTableOrderId, getTableOccupiedAt, getTableOrder, freeTable, resetTable,
    showAppError,
  } = useApp();

  // Cashier Active Tab State
  const [cashierTab, setCashierTab] = useState<'orders' | 'history' | 'payments' | 'menu' | 'reports' | 'qr' | 'reviews' | 'tables'>('orders');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'completed' | 'served' | 'rejected'>('all');

  // Modals state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptOrderId, setAcceptOrderId] = useState('');
  const [estTimeInput, setEstTimeInput] = useState(15);

  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);

  // Menu editor search
  const [menuSearch, setMenuSearch] = useState('');

  // Menu editor modal states
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

   // Edit product form state
  const [editProductId, setEditProductId] = useState('');
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState(0);
  const [editProdCat, setEditProdCat] = useState('tea');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdPrep, setEditProdPrep] = useState(5);
  const [editProdAvailable, setEditProdAvailable] = useState(true);
  const [editProductImage, setEditProductImage] = useState('');
  const [editProdBlobPreview, setEditProdBlobPreview] = useState('');

  // Add product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newProductCategory, setNewProductCategory] = useState('tea');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrep, setNewProductPrep] = useState(5);
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductBlobPreview, setNewProductBlobPreview] = useState('');

  // Edit image form state
  const [editingProductId, setEditingProductId] = useState('');
  const [editingProductName, setEditingProductName] = useState('');
  const [editImageURL, setEditImageURL] = useState('');
  const [editImageBlobPreview, setEditImageBlobPreview] = useState('');

  // Delete confirmation state
  const [deletingProductId, setDeletingProductId] = useState('');
  const [deletingProductName, setDeletingProductName] = useState('');

  // Category management state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);
  const [renamingCategory, setRenamingCategory] = useState('');
  const [renameCategoryInput, setRenameCategoryInput] = useState('');
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState('');
  const [moveTargetCategory, setMoveTargetCategory] = useState('');

  // QR Generator configuration state
  const [qrBaseUrl, setQrBaseUrl] = useState(() => {
    return localStorage.getItem('gc_qr_base_url') || window.location.origin;
  });
  const [qrTab, setQrTab] = useState<'counter' | 'tables'>('tables');

  // Stats calculation
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrdersList = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;
    const totalRev = orders.reduce((sum, o) => sum + (o.status !== 'rejected' ? o.total : 0), 0);

    return {
      todayOrders: todayOrdersList.length,
      pending: pendingCount,
      preparing: preparingCount,
      ready: readyCount,
      totalRevenue: totalRev,
    };
  }, [orders]);

  const salesReportData = useMemo(() => getSalesReport(), [orders, getSalesReport]);

  // Handlers
  const handleOpenAcceptModal = (id: string) => {
    setAcceptOrderId(id);
    setEstTimeInput(15);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = () => {
    if (acceptOrderId) {
      updateOrderStatus(acceptOrderId, 'preparing', { estTime: estTimeInput });
    }
    setShowAcceptModal(false);
    setAcceptOrderId('');
  };

  const handleOpenRejectModal = (id: string) => {
    setRejectOrderId(id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (rejectOrderId) {
      updateOrderStatus(rejectOrderId, 'rejected', { rejectionReason: rejectionReason || 'Store too busy' });
    }
    setShowRejectModal(false);
    setRejectOrderId('');
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditProductId(prod.id);
    setEditProdName(prod.name);
    setEditProdPrice(prod.price);
    setEditProdCat(prod.category);
    setEditProdDesc(prod.description || '');
    setEditProdPrep(prod.preparationTime || 5);
    setEditProdAvailable(prod.available);
    setEditProductImage(prod.image || '');
    setEditProdBlobPreview('');
    setShowEditProductModal(true);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProdName.trim()) return;
    updateProduct(editProductId, {
      name: editProdName.trim(),
      price: Number(editProdPrice),
      category: editProdCat,
      description: editProdDesc.trim(),
      preparationTime: Number(editProdPrep),
      image: editProdBlobPreview || editProductImage,
      available: editProdAvailable,
    });
    setShowEditProductModal(false);
  };

  const handleSaveAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;
    addProduct({
      name: newProductName.trim(),
      price: Number(newProductPrice),
      category: newProductCategory,
      description: newProductDesc.trim(),
      preparationTime: Number(newProductPrep),
      image: newProductBlobPreview || newProductImage || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
    });
    setShowAddProductModal(false);
    setNewProductName('');
    setNewProductPrice(0);
    setNewProductDesc('');
    setNewProductImage('');
    setNewProductBlobPreview('');
  };

  const handleOpenEditImage = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditingProductName(prod.name);
    setEditImageURL(prod.image || '');
    setEditImageBlobPreview('');
    setShowEditImageModal(true);
  };

  const handleSaveEditImage = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImg = editImageBlobPreview || editImageURL.trim();
    if (editingProductId) {
      updateProductImage(editingProductId, finalImg || '');
    }
    setShowEditImageModal(false);
  };

  const handleConfirmDeleteProduct = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
    }
    setShowDeleteConfirmModal(false);
    setDeletingProductId('');
  };

  const handleSaveBaseUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gc_qr_base_url', qrBaseUrl.trim());
    showAppError(`Base QR URL set to ${qrBaseUrl.trim()}`);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddCategoryModal(false);
  };

  const handleRenameCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingCategory || !renameCategoryInput.trim()) return;
    renameCategory(renamingCategory, renameCategoryInput.trim());
    setShowRenameCategoryModal(false);
  };

  const handleDeleteCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingCategory) return;
    if (moveTargetCategory) {
      const prodsToMove = products.filter(p => p.category === deletingCategory).map(p => p.id);
      moveProductsToCategory(prodsToMove, moveTargetCategory);
    } else {
      const prodsToDelete = products.filter(p => p.category === deletingCategory).map(p => p.id);
      deleteProducts(prodsToDelete);
    }
    deleteCategory(deletingCategory);
    setShowDeleteCategoryModal(false);
  };

  const handleSelectImageFile = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveBlobImage = (setPreview: (url: string) => void, setUrlState?: (url: string) => void) => {
    setPreview('');
    if (setUrlState) setUrlState('');
  };

  const activeCashierOrders = useMemo(() => {
    return orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  }, [orders]);

  const filteredHistory = useMemo(() => {
    if (historyFilter === 'all') return orderHistory;
    return orderHistory.filter(o => o.status === historyFilter);
  }, [orderHistory, historyFilter]);

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg text-slate-800 dark:text-slate-100 flex flex-col selection:bg-brand-emerald selection:text-white">
      {/* ── Navbar Header ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md border-b border-slate-200/80 dark:border-brand-dark-border px-6 py-3 shadow-sm">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <SVGLogo size={36} />
            <div>
              <h1 className="text-base font-black text-brand-emerald dark:text-white tracking-tight flex items-center gap-2">
                GENZCHIYA
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald dark:bg-brand-amber/20 dark:text-brand-amber border border-brand-emerald/20 dark:border-brand-amber/30">
                  Cashier POS
                </span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Smart Staff Workspace
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-brand-dark-bg p-1.5 rounded-2xl border border-slate-200 dark:border-brand-dark-border">
            <button
              onClick={() => navigate('/admin/cashier')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer bg-brand-emerald text-white shadow-md"
            >
              <span>💰</span>
              <span>Cashier Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/admin/kitchen')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10"
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

      {/* ── Main Full-Width Cashier Interface ── */}
      <main className="flex-1 w-full p-6 space-y-6 max-w-7xl mx-auto">
        {/* Metric Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-brand-dark-card border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Orders</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.todayOrders}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark-card border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Approvals</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
              <AlertCircle size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark-card border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Prep</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.preparing}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <Timer size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark-card border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Serving Ready</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.ready}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        {/* Cashier Feature Tabs */}
        <div className="bg-white dark:bg-brand-dark-card rounded-3xl border border-slate-200/80 dark:border-brand-dark-border shadow-md overflow-hidden">
          {/* Tab Selection Navigation Bar */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-brand-dark-bg/60 border-b border-slate-200/80 dark:border-brand-dark-border overflow-x-auto scrollbar-hide">
            {[
              { id: 'orders', label: 'Live Queue', icon: ShoppingBag, count: stats.pending },
              { id: 'history', label: 'Order History', icon: Clock, count: orderHistory.length },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'menu', label: 'Menu Editor', icon: Layers },
              { id: 'reports', label: 'Sales Reports', icon: BarChart2 },
              { id: 'qr', label: 'Generate QR', icon: QrCode },
              { id: 'tables', label: 'Table Mgmt', icon: LayoutGrid },
              { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = cashierTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCashierTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-emerald text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-brand-emerald' : 'bg-rose-500 text-white'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-6">
            {/* 1. Live Queue Tab */}
            {cashierTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Active Cashier Queue ({activeCashierOrders.length})
                  </h3>
                  <span className="text-xs text-slate-400">Real-time status updates</span>
                </div>

                {activeCashierOrders.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 dark:text-slate-500 space-y-2">
                    <CheckCircle2 size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold">No active cashier items.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCashierOrders.map(order => (
                      <div
                        key={order.id}
                        className={`rounded-2xl border p-5 space-y-4 shadow-sm relative overflow-hidden transition-all ${
                          order.status === 'pending'
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                            : order.status === 'preparing'
                              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                              : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                        }`}
                      >
                        {/* Header info */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Order #{order.id.slice(-4)}
                            </span>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white">
                              Table #{order.tableNumber}
                            </h4>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'pending'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                              : order.status === 'preparing'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order items list */}
                        <div className="space-y-1.5 border-t border-b border-slate-200/60 dark:border-brand-dark-border/60 py-3 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between font-medium">
                              <span>{item.quantity}x {item.product.name}</span>
                              <span className="font-bold">Rs. {item.product.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Total & Payment details */}
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500">Total Amount:</span>
                          <span className="text-sm font-black text-brand-emerald dark:text-brand-amber">Rs. {order.total}</span>
                        </div>

                        {/* Cashier Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleOpenAcceptModal(order.id)}
                                className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white text-xs font-extrabold py-2.5 rounded-xl shadow transition-all cursor-pointer"
                              >
                                Accept Order
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(order.id)}
                                className="px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {order.status === 'preparing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold py-2.5 rounded-xl shadow transition-all cursor-pointer"
                            >
                              Mark Ready to Serve
                            </button>
                          )}

                          {order.status === 'ready' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'served')}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2.5 rounded-xl shadow transition-all cursor-pointer"
                            >
                              Complete &amp; Clear Table #{order.tableNumber}
                            </button>
                          )}

                          <button
                            onClick={() => setActiveReceiptOrder(order)}
                            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-brand-dark-bg dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-bold py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                          >
                            <Printer size={12} />
                            <span>Print Receipt</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Order History Tab */}
            {cashierTab === 'history' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Order History Log ({filteredHistory.length})
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-brand-dark-bg p-1 rounded-xl">
                    {['all', 'completed', 'served', 'rejected'].map(f => (
                      <button
                        key={f}
                        onClick={() => setHistoryFilter(f as any)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                          historyFilter === f
                            ? 'bg-white dark:bg-brand-dark-card text-brand-emerald dark:text-brand-amber shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-brand-dark-border rounded-2xl overflow-hidden bg-white dark:bg-brand-dark-card shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-brand-dark-bg text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200/80 dark:border-brand-dark-border">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Table</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Time</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-brand-dark-border/40 font-medium">
                        {filteredHistory.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-slate-400">
                              No matching order history records.
                            </td>
                          </tr>
                        ) : (
                          filteredHistory.map(o => (
                            <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                              <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">#{o.id.slice(-6)}</td>
                              <td className="py-3 px-4 font-bold text-brand-emerald dark:text-brand-amber">Table #{o.tableNumber}</td>
                              <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">
                                {o.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                              </td>
                              <td className="py-3 px-4 font-black">Rs. {o.total}</td>
                              <td className="py-3 px-4 uppercase text-[10px] font-bold tracking-wider">{o.payment?.method || 'cash'}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  o.status === 'served' || o.status === 'completed'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-400 text-[11px]">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => setActiveReceiptOrder(o)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                  title="Print Receipt"
                                >
                                  <Printer size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Payments Tab */}
            {cashierTab === 'payments' && (
              <PaymentSummaryPanel
                orders={orders}
                orderHistory={orderHistory}
                onClearHistory={clearPaymentHistory}
              />
            )}

            {/* 4. Menu Editor Tab */}
            {cashierTab === 'menu' && (
              <div className="space-y-6">
                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      placeholder="Search menu items..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setNewCategoryName(''); setShowAddCategoryModal(true); }}
                      className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-brand-dark-card dark:hover:bg-brand-dark-bg text-slate-700 dark:text-slate-200 font-bold text-[11px] py-1.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plus size={12} />
                      <span>New Category</span>
                    </button>
                    <button
                      onClick={() => {
                        setNewProductName('');
                        setNewProductPrice(0);
                        setNewProductCategory(categories[0] || '');
                        setNewProductDesc('');
                        setNewProductPrep(5);
                        setNewProductImage('');
                        setNewProductBlobPreview('');
                        setShowAddProductModal(true);
                      }}
                      className="flex items-center gap-1.5 bg-brand-emerald hover:bg-brand-sage text-white font-bold text-[11px] py-1.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plus size={12} />
                      <span>New Product</span>
                    </button>
                  </div>
                </div>

                {/* Products Grid by Category */}
                <div className="space-y-6">
                  {categories.map(cat => {
                    const catProducts = products.filter(p => p.category === cat && p.name.toLowerCase().includes(menuSearch.toLowerCase()));
                    if (menuSearch && catProducts.length === 0) return null;

                    return (
                      <div key={cat} className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-brand-dark-border pb-2">
                          <h4 className="text-xs font-black uppercase tracking-widest text-brand-emerald dark:text-brand-amber flex items-center gap-2">
                            <Folder size={14} />
                            <span>{cat}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({catProducts.length} items)</span>
                          </h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setRenamingCategory(cat); setRenameCategoryInput(cat); setShowRenameCategoryModal(true); }}
                              className="text-[10px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => { setDeletingCategory(cat); setMoveTargetCategory(categories.find(c => c !== cat) || ''); setShowDeleteCategoryModal(true); }}
                              className="text-[10px] font-bold text-rose-400 hover:text-rose-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {catProducts.map(product => (
                            <div
                              key={product.id}
                              className="bg-white dark:bg-brand-dark-bg border border-slate-200/80 dark:border-brand-dark-border rounded-2xl p-4 flex gap-4 shadow-sm relative group"
                            >
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                <button
                                  onClick={() => handleOpenEditImage(product)}
                                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold"
                                >
                                  Edit Img
                                </button>
                              </div>

                              <div className="flex-1 space-y-1">
                                <div className="flex items-start justify-between">
                                  <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">{product.name}</h5>
                                  <span className="text-xs font-black text-brand-emerald dark:text-brand-amber">Rs. {product.price}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2">{product.description}</p>
                                
                                <div className="pt-2 flex items-center justify-between">
                                  <button
                                    onClick={() => toggleProductAvailability(product.id)}
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase cursor-pointer ${
                                      product.available
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}
                                  >
                                    {product.available ? 'Available' : 'Out of Stock'}
                                  </button>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleOpenEditProduct(product)}
                                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => { setDeletingProductId(product.id); setDeletingProductName(product.name); setShowDeleteConfirmModal(true); }}
                                      className="p-1 text-rose-400 hover:text-rose-600"
                                    >
                                      <Trash size={13} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Sales Reports Tab */}
            {cashierTab === 'reports' && (() => {
              const report = getSalesReport();
              const hourlyTrend = Object.entries(report.ordersByHour).map(([hour, count]) => ({
                hour: `${hour}:00`,
                revenue: count * (report.totalOrders > 0 ? report.totalRevenue / report.totalOrders : 0),
                orders: count,
              }));
              const paymentBreakdown = [
                { name: 'Cash', value: report.revenueByPaymentMethod.cash },
                { name: 'Khalti', value: report.revenueByPaymentMethod.khalti },
              ].filter(p => p.value > 0);
              return (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Sales Analytics &amp; Performance
                  </h3>
                  <button
                    onClick={clearPaymentHistory}
                    className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw size={12} />
                    <span>Clear Sales History</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Trend Chart */}
                  <div className="bg-white dark:bg-brand-dark-bg p-5 rounded-2xl border border-slate-200/80 dark:border-brand-dark-border space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Hourly Revenue Trend</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hourlyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                          <YAxis stroke="#94a3b8" fontSize={10} />
                          <Tooltip />
                          <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Payment Method Breakdown Chart */}
                  <div className="bg-white dark:bg-brand-dark-bg p-5 rounded-2xl border border-slate-200/80 dark:border-brand-dark-border space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Payment Method Breakdown</h4>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={paymentBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {paymentBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ec4899'][index % 4]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
              );
            })()}

            {/* 6. Generate QR Tab */}
            {cashierTab === 'qr' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-brand-dark-border pb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Table QR Code Generator
                    </h3>
                    <p className="text-xs text-slate-400">Generate scannable QR codes for table dining</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Add/Remove Table Controller */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-brand-dark-bg p-1.5 rounded-xl border border-slate-200 dark:border-brand-dark-border">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-1">Total Tables:</span>
                      <button
                        type="button"
                        onClick={() => setTotalTables(totalTables - 1)}
                        disabled={totalTables <= 1}
                        className="p-1 rounded-lg bg-white dark:bg-brand-dark-card text-slate-700 dark:text-slate-200 disabled:opacity-40 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Remove table"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={totalTables}
                        onChange={(e) => setTotalTables(parseInt(e.target.value) || 1)}
                        className="w-12 text-center text-xs font-black bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-brand-dark-border rounded-lg py-1 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setTotalTables(totalTables + 1)}
                        disabled={totalTables >= 100}
                        className="p-1 rounded-lg bg-white dark:bg-brand-dark-card text-slate-700 dark:text-slate-200 disabled:opacity-40 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Add table"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveBaseUrl} className="flex gap-2 max-w-md w-full sm:w-auto">
                      <input
                        type="url"
                        value={qrBaseUrl}
                        onChange={(e) => setQrBaseUrl(e.target.value)}
                        placeholder="Base URL (e.g. http://192.168.1.5:5173)"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-mono"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-brand-emerald hover:bg-brand-sage text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors cursor-pointer shrink-0"
                      >
                        Save URL
                      </button>
                    </form>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: totalTables }, (_, i) => String(i + 1)).map(t => (
                    <TableQRCard key={t} tableNumber={t} baseUrl={qrBaseUrl} />
                  ))}
                </div>
              </div>
            )}

            {/* 7. Table Mgmt Tab */}
            {cashierTab === 'tables' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-brand-dark-border pb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Live Table Status ({totalTables} Tables)
                    </h3>

                    {/* Add/Remove Table Controller */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-brand-dark-bg p-1.5 rounded-xl border border-slate-200 dark:border-brand-dark-border">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-1">Tables:</span>
                      <button
                        type="button"
                        onClick={() => setTotalTables(totalTables - 1)}
                        disabled={totalTables <= 1}
                        className="p-1 rounded-lg bg-white dark:bg-brand-dark-card text-slate-700 dark:text-slate-200 disabled:opacity-40 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Remove table"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={totalTables}
                        onChange={(e) => setTotalTables(parseInt(e.target.value) || 1)}
                        className="w-12 text-center text-xs font-black bg-white dark:bg-brand-dark-card border border-slate-200 dark:border-brand-dark-border rounded-lg py-1 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setTotalTables(totalTables + 1)}
                        disabled={totalTables >= 100}
                        className="p-1 rounded-lg bg-white dark:bg-brand-dark-card text-slate-700 dark:text-slate-200 disabled:opacity-40 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Add table"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>Available</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span>Occupied</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: totalTables }, (_, i) => String(i + 1)).map(t => {
                    const status = getTableStatus(t);
                    const isOcc = status === 'occupied';
                    return (
                      <div
                        key={t}
                        className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                          isOcc
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                            : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-slate-900 dark:text-white">#{t}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            isOcc ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {status}
                          </span>
                        </div>

                        {isOcc && (
                          <button
                            onClick={() => resetTable(t)}
                            className="w-full bg-white dark:bg-brand-dark-card hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold py-1.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                          >
                            Free Table
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 9. Reviews Tab */}
            {cashierTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Customer Reviews ({reviews.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map(r => (
                    <div key={r.id} className="p-4 rounded-2xl border border-slate-200/80 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card space-y-2 shadow-sm relative">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{r.name}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{r.comment}"</p>
                      <span className="text-[10px] text-slate-400 block">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Accept Order Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border">
            <h4 className="text-base font-black text-slate-900 dark:text-white">Accept Order &amp; Set Prep Time</h4>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Estimated Preparation Minutes:</label>
              <input
                type="number"
                min={5}
                max={90}
                value={estTimeInput}
                onChange={(e) => setEstTimeInput(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-sm font-bold"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmAccept}
                className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer"
              >
                Confirm Accept
              </button>
              <button
                onClick={() => setShowAcceptModal(false)}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Order Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border">
            <h4 className="text-base font-black text-rose-600">Reject Order</h4>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Reason for Rejection:</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Item out of stock, kitchen busy..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-medium h-20"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmReject}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt PDF Modal */}
      {activeReceiptOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveReceiptOrder(null)}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setActiveReceiptOrder(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X size={16} />
            </button>
            <ReceiptPDF
              order={activeReceiptOrder}
              elementId={`receipt-${activeReceiptOrder.id}`}
            />
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => downloadReceiptPDF(`receipt-${activeReceiptOrder.id}`, `receipt-${activeReceiptOrder.id}.pdf`)}
                className="flex items-center gap-2 bg-brand-emerald hover:bg-brand-sage text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition-colors cursor-pointer"
              >
                <Printer size={14} />
                Print / Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900 dark:text-white">Edit Product</h4>
              <button onClick={() => setShowEditProductModal(false)} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveEditProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Product Name</label>
                <input type="text" value={editProdName} onChange={(e) => setEditProdName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
                  <select value={editProdCat} onChange={(e) => setEditProdCat(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Price (Rs.)</label>
                  <input type="number" value={editProdPrice} onChange={(e) => setEditProdPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" required min={0} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                <textarea value={editProdDesc} onChange={(e) => setEditProdDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-medium h-16 resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Preparation Time (mins)</label>
                <input type="number" value={editProdPrep} onChange={(e) => setEditProdPrep(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" required min={1} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Availability</label>
                <button type="button" onClick={() => setEditProdAvailable(prev => !prev)} className={`px-3 py-1.5 rounded-full text-xs font-black uppercase cursor-pointer ${
                  editProdAvailable
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {editProdAvailable ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Image</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="file" accept="image/*" onChange={(e) => handleSelectImageFile(e, setEditProdBlobPreview)} className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-emerald file:text-white hover:file:bg-brand-sage cursor-pointer" />
                    {(editProdBlobPreview || editProductImage) && (
                      <button type="button" onClick={() => handleRemoveBlobImage(setEditProdBlobPreview, setEditProductImage)} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer">Remove</button>
                    )}
                  </div>
                  {(editProdBlobPreview || editProductImage) && (
                    <img src={editProdBlobPreview || editProductImage} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                  )}
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900 dark:text-white">Add New Product</h4>
              <button onClick={() => setShowAddProductModal(false)} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveAddProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Product Name</label>
                <input type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
                  <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Price (Rs.)</label>
                  <input type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" required min={0} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                <textarea value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-medium h-16 resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Preparation Time (mins)</label>
                <input type="number" value={newProductPrep} onChange={(e) => setNewProductPrep(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" required min={1} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Image</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="file" accept="image/*" onChange={(e) => handleSelectImageFile(e, setNewProductBlobPreview)} className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-emerald file:text-white hover:file:bg-brand-sage cursor-pointer" />
                    {newProductBlobPreview && (
                      <button type="button" onClick={() => handleRemoveBlobImage(setNewProductBlobPreview, setNewProductImage)} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer">Remove</button>
                    )}
                  </div>
                  {newProductBlobPreview && (
                    <img src={newProductBlobPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                  )}
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer">Add Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {showEditImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900 dark:text-white">Edit Image</h4>
              <button onClick={() => setShowEditImageModal(false)} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium">{editingProductName}</p>
            <form onSubmit={handleSaveEditImage} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Image URL</label>
                <input type="text" value={editImageURL} onChange={(e) => setEditImageURL(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-500">Or upload file:</label>
                  <input type="file" accept="image/*" onChange={(e) => handleSelectImageFile(e, setEditImageBlobPreview)} className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-emerald file:text-white hover:file:bg-brand-sage cursor-pointer" />
                  {editImageBlobPreview && (
                    <button type="button" onClick={() => handleRemoveBlobImage(setEditImageBlobPreview, setEditImageURL)} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 cursor-pointer">Remove</button>
                  )}
                </div>
                {(editImageBlobPreview || editImageURL) && (
                  <img src={editImageBlobPreview || editImageURL} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                )}
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer">Save Image</button>
                <button type="button" onClick={() => setShowEditImageModal(false)} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirm Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border">
            <h4 className="text-base font-black text-rose-600">Delete Product</h4>
            <p className="text-xs text-slate-500">Are you sure you want to delete <span className="font-bold text-slate-700">{deletingProductName}</span>? This action cannot be undone.</p>
            <div className="flex gap-2 pt-2">
              <button onClick={handleConfirmDeleteProduct} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer">Delete</button>
              <button onClick={() => setShowDeleteConfirmModal(false)} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border">
            <h4 className="text-base font-black text-slate-900 dark:text-white">New Category</h4>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Category name" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" required />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer">Add Category</button>
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Category Modal */}
      {showRenameCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border">
            <h4 className="text-base font-black text-slate-900 dark:text-white">Rename Category</h4>
            <form onSubmit={handleRenameCategorySubmit} className="space-y-3">
              <input type="text" value={renameCategoryInput} onChange={(e) => setRenameCategoryInput(e.target.value)} placeholder="New category name" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold" required />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer">Rename</button>
                <button type="button" onClick={() => setShowRenameCategoryModal(false)} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-brand-dark-border">
            <h4 className="text-base font-black text-rose-600">Delete Category</h4>
            <p className="text-xs text-slate-500">Delete <span className="font-bold text-slate-700">{deletingCategory}</span>?</p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 block">Move products to:</label>
              <select value={moveTargetCategory} onChange={(e) => setMoveTargetCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-bg text-xs font-semibold">
                <option value="">-- Delete all products in this category --</option>
                {categories.filter(c => c !== deletingCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <form onSubmit={handleDeleteCategorySubmit}>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow cursor-pointer">Delete Category</button>
                <button type="button" onClick={() => setShowDeleteCategoryModal(false)} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
