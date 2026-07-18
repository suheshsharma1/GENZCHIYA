import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Bell, LayoutGrid, List, ChefHat, Timer, BellRing, QrCode, Download, Minus,
  Folder, FolderOpen, ChevronDown, ChevronRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { Order, Product } from '../types';
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
    orders, products, categories, updateOrderStatus, toggleProductAvailability, 
    updateProduct, updateProductImage, deleteProduct, deleteProducts, 
    addCategory, renameCategory, deleteCategory, moveProductsToCategory,
    getSalesReport, resetAllData, logoutStaff 
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
  const [menuSearch, setMenuSearch] = useState('');

  // Menu editor modal states
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Edit product form state
  const [editProductId, setEditProductId] = useState('');
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState(0);
  const [editProdCat, setEditProdCat] = useState('tea');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdPrep, setEditProdPrep] = useState(5);
  const [editProductImage, setEditProductImage] = useState('');
  const [editProdBlobPreview, setEditProdBlobPreview] = useState('');

  // Edit image form state
  const [editingProductId, setEditingProductId] = useState('');
  const [editingProductName, setEditingProductName] = useState('');
  const [editImageURL, setEditImageURL] = useState('');
  const [editImageBlobPreview, setEditImageBlobPreview] = useState('');

  // Delete confirmation state
  const [deletingProductId, setDeletingProductId] = useState('');
  const [deletingProductName, setDeletingProductName] = useState('');

  // Bulk delete state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Category management state
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);
  const [renamingCategory, setRenamingCategory] = useState('');
  const [renameCategoryValue, setRenameCategoryValue] = useState('');
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [deletingCategoryName, setDeletingCategoryName] = useState('');
  const [showBulkCategoryDeleteModal, setShowBulkCategoryDeleteModal] = useState(false);
  const [showMoveCategoryModal, setShowMoveCategoryModal] = useState(false);
  const [moveTargetCategory, setMoveTargetCategory] = useState('');

  // Transient success toast
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successTimeoutRef = useRef<number | null>(null);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = window.setTimeout(() => setSuccessMessage(null), 3000);
  };

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

  // Search is applied per-category inside the folder rendering below.

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

  // Export CSV Report
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

  const handleEditProduct = (product: Product) => {
    setEditProductId(product.id);
    setEditProdName(product.name);
    setEditProdPrice(product.price);
    setEditProdCat(product.category);
    setEditProdDesc(product.description);
    setEditProdPrep(product.preparationTime);
    setEditProductImage(product.image);
    setEditProdBlobPreview('');
    setShowEditProductModal(true);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductId || !editProdName || !editProdPrice) return;
    updateProduct(editProductId, {
      name: editProdName,
      price: Number(editProdPrice),
      category: editProdCat,
      description: editProdDesc,
      preparationTime: Number(editProdPrep),
      image: editProductImage
    });
    setShowEditProductModal(false);
    setEditProductId('');
  };

  const handleEditImage = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProductName(product.name);
    setEditImageURL(product.image);
    setEditImageBlobPreview('');
    setShowEditImageModal(true);
  };

  // Image fields use relative paths (e.g. /images/products/item.jpg) — no FileReader/Base64

  const handleEditImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;
    updateProductImage(editingProductId, editImageURL.trim());
    setShowEditImageModal(false);
    setEditingProductId('');
    setEditingProductName('');
    setEditImageURL('');
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProductId(product.id);
    setDeletingProductName(product.name);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteProduct = () => {
    if (!deletingProductId) return;
    const idToDelete = deletingProductId;
    const name = deletingProductName;
    deleteProduct(idToDelete);
    setShowDeleteConfirmModal(false);
    setSelectedProductIds(prev => prev.filter(id => id !== idToDelete));
    setDeletingProductId('');
    setDeletingProductName('');
    showSuccess(`"${name}" deleted successfully.`);
  };

  // Bulk delete helpers
  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    deleteProducts(selectedProductIds);
    setSelectedProductIds([]);
    setShowBulkDeleteModal(false);
    showSuccess(`${count} product${count > 1 ? 's' : ''} deleted successfully.`);
  };

  // Category management helpers
  const productCountByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [products]);

  const categoryProducts = useMemo(() => {
    const map: Record<string, Product[]> = {};
    categories.forEach(c => { map[c] = []; });
    products.forEach(p => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [products, categories]);

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const toggleCategorySelection = (cat: string) => {
    const ids = (categoryProducts[cat] || []).map(p => p.id);
    setSelectedCategoryIds(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    // Selecting a category also selects (or clears) all products inside it
    setSelectedProductIds(prev => {
      const alreadyAll = ids.length > 0 && ids.every(id => prev.includes(id));
      if (alreadyAll) {
        return prev.filter(id => !ids.includes(id));
      }
      return Array.from(new Set([...prev, ...ids]));
    });
  };

  const isCategoryPartiallySelected = (cat: string): boolean => {
    const ids = (categoryProducts[cat] || []).map(p => p.id);
    return ids.some(id => selectedProductIds.includes(id)) && !ids.every(id => selectedProductIds.includes(id));
  };

  const handleAddCategory = () => {
    const created = addCategory(newCategoryName);
    if (created) {
      showSuccess(`Category "${newCategoryName.trim()}" created.`);
      setShowAddCategoryModal(false);
      setNewCategoryName('');
    } else {
      showSuccess('Category name already exists or is invalid.');
    }
  };

  const handleRenameCategory = () => {
    const ok = renameCategory(renamingCategory, renameCategoryValue);
    if (ok) {
      showSuccess(`Category renamed to "${renameCategoryValue.trim()}".`);
    } else {
      showSuccess('Category name already exists or is invalid.');
    }
    setShowRenameCategoryModal(false);
    setRenamingCategory('');
    setRenameCategoryValue('');
  };

  const handleDeleteCategory = () => {
    const count = productCountByCategory[deletingCategoryName] || 0;
    deleteCategory(deletingCategoryName);
    setSelectedCategoryIds(prev => prev.filter(c => c !== deletingCategoryName));
    setShowDeleteCategoryModal(false);
    setDeletingCategoryName('');
    showSuccess(count > 0
      ? `Category deleted. ${count} product${count > 1 ? 's' : ''} removed.`
      : 'Category deleted.');
  };

  const handleBulkCategoryDelete = () => {
    if (selectedCategoryIds.length === 0) return;
    const count = selectedCategoryIds.length;
    let productCount = 0;
    selectedCategoryIds.forEach(c => { productCount += productCountByCategory[c] || 0; });
    selectedCategoryIds.forEach(c => deleteCategory(c));
    setSelectedCategoryIds([]);
    setShowBulkCategoryDeleteModal(false);
    showSuccess(`${count} categor${count > 1 ? 'ies' : 'y'} deleted. ${productCount} product${productCount === 1 ? '' : 's'} removed.`);
  };

  const handleMoveProducts = () => {
    if (!moveTargetCategory || selectedProductIds.length === 0) return;
    moveProductsToCategory(selectedProductIds, moveTargetCategory);
    showSuccess(`Moved ${selectedProductIds.length} product${selectedProductIds.length > 1 ? 's' : ''} to ${moveTargetCategory}.`);
    setSelectedProductIds([]);
    setShowMoveCategoryModal(false);
    setMoveTargetCategory('');
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">

      {/* Transient success toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
          >
            <div className="flex items-center gap-2 bg-brand-emerald dark:bg-brand-amber text-white dark:text-brand-dark-bg font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg">
              <CheckCircle2 size={14} />
              <span>{successMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <button
                    onClick={() => { setNewCategoryName(''); setShowAddCategoryModal(true); }}
                    className="flex items-center gap-1.5 bg-brand-emerald hover:bg-brand-sage text-white font-bold text-[11px] py-1.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={12} />
                    <span>New Category</span>
                  </button>
                </div>

                {/* Category folders */}
                <div className="space-y-3">
                  {categories.map(cat => {
                    const isCollapsed = collapsedCategories.has(cat);
                    const count = productCountByCategory[cat] || 0;
                    const catSelected = selectedCategoryIds.includes(cat);
                    const catProducts = (categoryProducts[cat] || []).filter(p =>
                      p.name.toLowerCase().includes(menuSearch.toLowerCase())
                    );
                    const visibleCount = catProducts.length;
                    const catProductIds = (categoryProducts[cat] || []).map(p => p.id);
                    const allProductsSelected = catProductIds.length > 0 && catProductIds.every(id => selectedProductIds.includes(id));
                    const catCheckboxChecked = catSelected || allProductsSelected;
                    return (
                      <div key={cat} className={`bg-white dark:bg-brand-dark-card rounded-2xl border shadow-sm overflow-hidden ${catSelected ? 'border-brand-amber dark:border-brand-amber ring-2 ring-brand-amber/30' : 'border-slate-200/50 dark:border-brand-dark-border/40'}`}>
                        {/* Folder header */}
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50/70 dark:bg-brand-dark-bg/40 border-b border-slate-100 dark:border-slate-800">
                          <label className="flex items-center justify-center w-5 h-5 rounded-md bg-white dark:bg-brand-dark-bg border border-slate-200 dark:border-brand-dark-border cursor-pointer shadow-sm hover:bg-white">
                            <input
                              type="checkbox"
                              checked={catCheckboxChecked}
                              ref={(el) => { if (el) el.indeterminate = isCategoryPartiallySelected(cat); }}
                              onChange={() => toggleCategorySelection(cat)}
                              className="w-3.5 h-3.5 accent-brand-amber dark:accent-brand-amber cursor-pointer"
                            />
                          </label>
                          <button onClick={() => toggleCategoryCollapse(cat)} className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer">
                            {isCollapsed ? <ChevronRight size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                            {isCollapsed ? <Folder size={16} className="text-brand-amber shrink-0" /> : <FolderOpen size={16} className="text-brand-amber shrink-0" />}
                            <span className="font-extrabold text-sm text-slate-800 dark:text-white capitalize truncate">{cat}</span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-brand-dark-bg px-2 py-0.5 rounded-full shrink-0">{count}</span>
                          </button>
                          <button
                            onClick={() => { setRenamingCategory(cat); setRenameCategoryValue(cat); setShowRenameCategoryModal(true); }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-brand-dark-bg/60 cursor-pointer"
                            title="Rename Category"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => { setDeletingCategoryName(cat); setShowDeleteCategoryModal(true); }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash size={12} />
                          </button>
                        </div>

                        {/* Folder contents */}
                        {!isCollapsed && (
                          <div className="p-3">
                            {visibleCount === 0 ? (
                              <p className="text-center text-[11px] text-slate-400 py-4">
                                {count === 0 ? 'No products in this category yet.' : 'No products match your search.'}
                              </p>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {catProducts.map(p => {
                                  const isSelected = selectedProductIds.includes(p.id);
                                  return (
                                  <div key={p.id} className={`rounded-xl overflow-hidden shadow-sm border flex flex-col justify-between text-left group ${isSelected ? 'border-brand-emerald dark:border-brand-amber ring-2 ring-brand-emerald/30 dark:ring-brand-amber/30' : 'border-slate-200/50 dark:border-brand-dark-border/40'}`}>
                                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                                      <label className="absolute top-2 left-2 z-10 flex items-center justify-center w-5 h-5 rounded-md bg-white/85 dark:bg-brand-dark-bg/85 backdrop-blur-sm border border-slate-200 dark:border-brand-dark-border cursor-pointer shadow-sm hover:bg-white">
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => toggleProductSelection(p.id)}
                                          className="w-3.5 h-3.5 accent-brand-emerald dark:accent-brand-amber cursor-pointer"
                                        />
                                      </label>
                                      {p.image ? (
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-[9px] font-semibold">No Image</div>
                                      )}
                                      {!p.available && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">Out of Stock</span>
                                      )}
                                    </div>
                                    <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                                      <div>
                                        <div className="flex justify-between items-start gap-1">
                                          <h4 className="font-extrabold text-[11px] text-slate-800 dark:text-white line-clamp-1">{p.name}</h4>
                                          <span className="font-black text-brand-emerald dark:text-brand-amber text-[10px] shrink-0">{formatRs(p.price)}</span>
                                        </div>
                                        <p className="text-[8px] text-slate-400 mt-0.5 line-clamp-2 h-5">{p.description}</p>
                                      </div>
                                      <div className="flex gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                        <button onClick={() => handleEditProduct(p)} className="flex-1 py-1 px-1 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-brand-dark-bg/40 rounded-lg text-slate-600 dark:text-slate-300 text-[8px] font-bold flex items-center justify-center gap-0.5 cursor-pointer" title="Edit">
                                          <Edit2 size={8} /> Edit
                                        </button>
                                        <button onClick={() => handleEditImage(p)} className="p-1 border border-slate-200 dark:border-brand-dark-border hover:bg-slate-50 dark:hover:bg-brand-dark-bg/40 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer" title="Upload Image"><Upload size={8} /></button>
                                        <button
                                          onClick={() => toggleProductAvailability(p.id)}
                                          className={`px-1.5 py-1 rounded-lg text-[7px] font-black uppercase cursor-pointer ${p.available ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'}`}
                                          title="Toggle Stock"
                                        >
                                          {p.available ? 'In' : 'Out'}
                                        </button>
                                        <button onClick={() => handleDeleteProduct(p)} className="p-1 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-500 cursor-pointer" title="Delete"><Trash size={8} /></button>
                                      </div>
                                    </div>
                                  </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {categories.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-brand-dark-card rounded-3xl border border-dashed border-slate-200 dark:border-brand-dark-border/60">
                      <Folder size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-slate-400 text-[11px] font-semibold">No categories. Create one to start adding products.</p>
                    </div>
                  )}
                </div>
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
        {/* Bulk Delete Confirmation Modal */}
        {showBulkDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBulkDeleteModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider mb-2">Delete Selected Products</h4>
              <p className="text-xs text-slate-400 mb-4">
                Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-white">{selectedProductIds.length}</span> product{selectedProductIds.length > 1 ? 's' : ''}? This action is permanent.
              </p>
              <div className="flex gap-2">
                <button onClick={confirmBulkDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Delete</button>
                <button onClick={() => setShowBulkDeleteModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </div>
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

        {/* Edit Product Modal */}
        {showEditProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditProductModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-4">Edit Product</h4>
              <form onSubmit={handleEditProductSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Product Name</label>
                  <input type="text" required value={editProdName} onChange={(e) => setEditProdName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Price (Rs.)</label>
                    <input type="number" required value={editProdPrice} onChange={(e) => setEditProdPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Prep Time (mins)</label>
                    <input type="number" required value={editProdPrep} onChange={(e) => setEditProdPrep(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                  <select value={editProdCat} onChange={(e) => setEditProdCat(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none capitalize">
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Description</label>
                  <input type="text" value={editProdDesc} onChange={(e) => setEditProdDesc(e.target.value)} placeholder="Description of item..." className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Image Path</label>
                  <div className="flex gap-2">
                    <input
                      id="split-edit-prod-image-path"
                      type="text"
                      value={editProductImage}
                      onChange={(e) => { setEditProductImage(e.target.value); setEditProdBlobPreview(''); }}
                      placeholder="/images/products/my-item.jpg"
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none font-mono"
                    />
                    <label
                      htmlFor="split-edit-prod-file-pick"
                      className="flex items-center gap-1 px-3 py-2 bg-brand-emerald hover:bg-brand-sage text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
                    >
                      <Upload size={12} /> Browse
                      <input
                        id="split-edit-prod-file-pick"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditProductImage(`/images/products/${file.name}`);
                            setEditProdBlobPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                  {(editProdBlobPreview || editProductImage) && (
                    <div className="mt-1 w-full h-24 rounded-xl overflow-hidden border border-slate-100 dark:border-brand-dark-border/40 bg-slate-50 dark:bg-brand-dark-bg">
                      <img
                        src={editProdBlobPreview || editProductImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <p className="text-[9px] text-slate-400">
                    📂 Browse গरेपछि image <code className="font-mono bg-slate-100 dark:bg-brand-dark-bg px-1 rounded">public/images/products/</code> मा copy गर्नुस् — path automatically fill हुन्छ।
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-brand-dark-border/20">
                  <button type="submit" className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Save Changes</button>
                  <button type="button" onClick={() => setShowEditProductModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Image (quick) Modal */}
        {showEditImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditImageModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-4">Change Product Image</h4>
              <p className="text-xs text-slate-400 mb-3">Product: <span className="font-bold text-slate-800 dark:text-white">{editingProductName}</span></p>
              <form onSubmit={handleEditImageSubmit} className="space-y-3">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Image Path</label>
                  <div className="flex gap-2">
                    <input
                      id="split-edit-image-path"
                      type="text"
                      value={editImageURL}
                      onChange={(e) => { setEditImageURL(e.target.value); setEditImageBlobPreview(''); }}
                      placeholder="/images/products/my-item.jpg"
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none font-mono"
                    />
                    <label
                      htmlFor="split-edit-image-file-pick"
                      className="flex items-center gap-1 px-3 py-2 bg-brand-emerald hover:bg-brand-sage text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
                    >
                      <Upload size={12} /> Browse
                      <input
                        id="split-edit-image-file-pick"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditImageURL(`/images/products/${file.name}`);
                            setEditImageBlobPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                  {(editImageBlobPreview || editImageURL) ? (
                    <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-100 dark:border-brand-dark-border/40 bg-slate-50 dark:bg-brand-dark-bg">
                      <img
                        src={editImageBlobPreview || editImageURL}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-36 rounded-xl border-2 border-dashed border-slate-200 dark:border-brand-dark-border flex flex-col items-center justify-center gap-1.5 bg-slate-50 dark:bg-brand-dark-bg">
                      <Upload size={18} className="text-slate-300 dark:text-slate-600" />
                      <span className="text-xs text-slate-400 font-semibold">Browse गरेर image छान्नुस्</span>
                    </div>
                  )}
                  <p className="text-[9px] text-slate-400">
                    📂 Browse गरेपछि image <code className="font-mono bg-slate-100 dark:bg-brand-dark-bg px-1 rounded">public/images/products/</code> मा copy गर्नुस् — path automatically fill हुन्छ।
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-brand-dark-border/20">
                  <button type="submit" className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Update Image</button>
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
              <p className="text-xs text-slate-400 mb-4">Are you sure you want to delete this product?<span className="font-bold text-slate-800 dark:text-white"> {deletingProductName}</span></p>
                <div className="flex gap-2">
                  <button onClick={confirmDeleteProduct} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Delete</button>
                  <button onClick={() => setShowDeleteConfirmModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
                </div>
              </motion.div>
            </div>
        )}

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddCategoryModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-4">New Category</h4>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                placeholder="e.g. Desserts"
                className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleAddCategory} className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Create</button>
                <button onClick={() => { setShowAddCategoryModal(false); setNewCategoryName(''); }} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Rename Category Modal */}
        {showRenameCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRenameCategoryModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-4">Rename Category</h4>
              <p className="text-xs text-slate-400 mb-3">Current name: <span className="font-bold text-slate-800 dark:text-white capitalize">{renamingCategory}</span></p>
              <input
                type="text"
                value={renameCategoryValue}
                onChange={(e) => setRenameCategoryValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCategory(); }}
                placeholder="New category name"
                className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleRenameCategory} className="flex-1 bg-brand-emerald hover:bg-brand-sage text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Rename</button>
                <button onClick={() => { setShowRenameCategoryModal(false); setRenamingCategory(''); setRenameCategoryValue(''); }} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Category Confirmation Modal */}
        {showDeleteCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteCategoryModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider mb-2">Delete Category</h4>
              <p className="text-xs text-slate-400 mb-4">
                Are you sure you want to delete the entire '<span className="font-bold text-slate-800 dark:text-white capitalize">{deletingCategoryName}</span>' category? This will permanently delete all products in this category.
              </p>
              <div className="flex gap-2">
                <button onClick={handleDeleteCategory} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Delete</button>
                <button onClick={() => setShowDeleteCategoryModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bulk Category Delete Confirmation Modal */}
        {showBulkCategoryDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBulkCategoryDeleteModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-red-500 uppercase tracking-wider mb-2">Delete Selected Categories</h4>
              <p className="text-xs text-slate-400 mb-4">
                Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-white">{selectedCategoryIds.length}</span> categor{selectedCategoryIds.length > 1 ? 'ies' : 'y'}? This will permanently delete all products inside them.
              </p>
              <div className="flex gap-2">
                <button onClick={handleBulkCategoryDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">Delete</button>
                <button onClick={() => setShowBulkCategoryDeleteModal(false)} className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Move Products to Category Modal */}
        {showMoveCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMoveCategoryModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-100 dark:border-brand-dark-border/40 text-slate-800 dark:text-white">
              <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-2">Move Products</h4>
              <p className="text-xs text-slate-400 mb-4">
                Move {selectedProductIds.length} selected product{selectedProductIds.length > 1 ? 's' : ''} to:
              </p>
              <select
                value={moveTargetCategory}
                onChange={(e) => setMoveTargetCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage mb-4 capitalize"
              >
                <option value="">Select category...</option>
                {categories.map(c => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
                <option value="__new__">+ Create new category...</option>
              </select>
              {moveTargetCategory === '__new__' && (
                <input
                  type="text"
                  value={renameCategoryValue}
                  onChange={(e) => setMoveTargetCategory(e.target.value.trim().toLowerCase())}
                  placeholder="New category name"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg rounded-xl text-xs outline-none focus:border-brand-sage mb-4"
                  autoFocus
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleMoveProducts}
                  disabled={!moveTargetCategory || moveTargetCategory === '__new__'}
                  className="flex-1 bg-brand-amber hover:bg-brand-gold disabled:opacity-40 disabled:cursor-not-allowed text-brand-dark-bg font-bold py-2 rounded-xl text-xs cursor-pointer"
                >
                  Move
                </button>
                <button
                  onClick={() => { setShowMoveCategoryModal(false); setMoveTargetCategory(''); setRenameCategoryValue(''); }}
                  className="flex-1 bg-slate-100 dark:bg-brand-dark-bg text-slate-500 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
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
