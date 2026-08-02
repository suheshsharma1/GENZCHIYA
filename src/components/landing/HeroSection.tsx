import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Check, Clock,
  Coffee, Leaf, Zap, ScanLine, QrCode,
  UtensilsCrossed, Sparkles, CheckCircle2,
  Lock, AlertTriangle, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import QRCode from 'qrcode';
import { QRScanner } from '../scanner/QRScanner';
import { SaturdayOfferBanner } from './SaturdayOfferBanner';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { setTable, lockTable, getTableStatus, getTableOrderId, getTableOccupiedAt, totalTables = 20 } = useApp();
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableError, setTableError] = useState<string>('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const isValidTable = useCallback((value: string): boolean => {
    const num = Number(value);
    return value.trim() !== '' && Number.isInteger(num) && num >= 1 && num <= totalTables;
  }, [totalTables]);

  const handleTableChange = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setSelectedTable('');
      setTableError('Please select a table number.');
      return;
    }
    if (!isValidTable(trimmed)) {
      setSelectedTable('');
      setTableError(`Table must be between 1 and ${totalTables}.`);
      return;
    }
    const status = getTableStatus(trimmed);
    if (status === 'occupied') {
      setSelectedTable('');
      setTableError('This table is currently occupied.');
      return;
    }
    setSelectedTable(trimmed);
    setTableError('');
  };

  const handleStartOrder = () => {
    if (!isValidTable(selectedTable)) {
      setTableError('Please select or scan a table before ordering.');
      return;
    }
    const status = getTableStatus(selectedTable);
    if (status === 'occupied') {
      setTableError('This table is currently occupied.');
      return;
    }
    lockTable(selectedTable);
    setTable(selectedTable);
    navigate(`/menu?table=${selectedTable}&category=mattai`);
  };

  const handleScanResult = (result: string) => {
    const match = result.match(/[?&]table=(\d+)/);
    if (match && match[1]) {
      const table = match[1];
      const num = Number(table);
      if (num >= 1 && num <= totalTables) {
        const status = getTableStatus(table);
        if (status === 'occupied') {
          setTableError('This table is currently occupied.');
          setIsScannerOpen(false);
          return;
        }
        setSelectedTable(table);
        setTableError('');
        setIsScannerOpen(false);
        return;
      }
    }
    setTableError('Scanned QR does not contain a valid table number.');
    setIsScannerOpen(false);
  };

  useEffect(() => {
    if (!selectedTable || !isValidTable(selectedTable)) {
      setQrDataUrl('');
      return;
    }
    const base = window.location.origin;
    const targetUrl = `${base}/menu?table=${selectedTable}&category=mattai`;
    QRCode.toDataURL(targetUrl, {
      margin: 2,
      width: 240,
      errorCorrectionLevel: 'M',
      color: { dark: '#0F172A', light: '#FFFFFF' },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [selectedTable, isValidTable]);

  const tableOptions = Array.from({ length: totalTables }, (_, i) => i + 1);
  const isStartEnabled = isValidTable(selectedTable);

  const featureItems = [
    { icon: Coffee, label: 'NO WAITING' },
    { icon: ShieldCheck, label: 'CONTACTLESS' },
    { icon: Leaf, label: 'FRESH & PURE' },
    { icon: Zap, label: 'INSTANT ORDER' },
  ];

  // Helper function to resolve table visual state
  const getTableState = (numStr: string): 'available' | 'occupied' | 'reserved' | 'cleaning' => {
    const status = getTableStatus(numStr) as string;
    if (numStr === '13') return 'reserved'; // Example reserved table
    if (status === 'occupied') return 'occupied';
    if (status === 'cleaning') return 'cleaning';
    return 'available';
  };

  // Status counts for floor status summary
  const availableCount = tableOptions.filter(n => getTableState(String(n)) === 'available').length;
  const occupiedCount = tableOptions.filter(n => getTableState(String(n)) === 'occupied').length;

  return (
    <section className="relative min-h-screen bg-brand-bg dark:bg-brand-dark-bg text-brand-text dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">
      {/* Top accent bar - Original Red Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-primary-light to-brand-primary-dark" />

      {/* Decorative background details */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft glowing ambient circles */}
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-brand-primary/[0.04] dark:bg-brand-primary/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] bg-brand-accent/[0.04] dark:bg-brand-accent/[0.08] rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] bg-brand-primary/[0.03] rounded-full blur-[130px]" />

        {/* Minimal floating café texture icons */}
        <div className="absolute top-36 left-12 opacity-[0.03] dark:opacity-[0.06] transform -rotate-12">
          <Coffee size={140} />
        </div>
        <div className="absolute bottom-28 right-16 opacity-[0.03] dark:opacity-[0.06] transform rotate-12">
          <UtensilsCrossed size={160} />
        </div>
        <div className="absolute top-1/2 right-1/3 opacity-[0.02] dark:opacity-[0.04]">
          <UtensilsCrossed size={180} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Saturday Offer Banner */}
        <SaturdayOfferBanner />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-8"
          >

            {/* Large Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-1"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-brand-text dark:text-white">
                ORDER
                <br />
                <span className="text-brand-primary">
                  SMARTER.
                </span>
                <br />
                <span className="text-gray-400 dark:text-gray-500">NOT HARDER.</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg font-medium"
            >
              Scan the table QR code or choose your seat manually to start ordering instantly with zero wait time.
            </motion.p>

            {/* Feature Icons - Circular */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              {featureItems.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-brand-dark-card/80 backdrop-blur-md border border-gray-100 dark:border-brand-dark-border shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:scale-105 transition-all duration-300 cursor-default"
                >
                  <item.icon size={14} className="text-brand-primary" />
                  <span className="text-[10px] font-bold text-brand-text dark:text-gray-200 uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Premium Order Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            {/* Card Container with Glassmorphism */}
            <div className="relative w-full max-w-md lg:max-w-lg">

              {/* Ambient Glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 via-brand-accent/15 to-brand-primary/20 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />

              <div className="relative bg-white/95 dark:bg-brand-dark-card/95 backdrop-blur-2xl rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/60 dark:border-brand-dark-border overflow-hidden transition-all duration-300">

                {/* 1. Original Red Café Theme Header */}
                <div className="bg-gradient-to-r from-brand-primary via-brand-primary-dark to-brand-primary px-6 py-5 text-center relative overflow-hidden border-b border-white/10">
                  {/* Subtle header ambient pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-extrabold uppercase tracking-widest mb-2 shadow-inner">
                      <Coffee size={13} className="text-white/90" />
                      <span>Dine-In Experience</span>
                    </div>

                    <h3 className="text-xl font-black text-white tracking-tight">
                      Select Your Table
                    </h3>

                    <p className="text-xs text-white/80 font-medium mt-1">
                      Choose your table or scan the QR code to begin.
                    </p>
                  </div>

                  {/* Real-time status counter bar */}
                  <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/15 text-[10px] font-bold text-white/90">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {availableCount} Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-300" />
                      {occupiedCount} Occupied
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-300" />
                      1 Reserved
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Error Banner */}
                  <AnimatePresence>
                    {tableError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 shadow-sm">
                          <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
                            <AlertTriangle size={13} className="text-white" />
                          </div>
                          <p className="text-xs font-bold text-rose-700 dark:text-rose-300">{tableError}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 2. QR Scan Card Section */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsScannerOpen(true)}
                      aria-label="Scan Table QR Code"
                      className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-brand-dark-border bg-gray-50/80 dark:bg-brand-dark-bg hover:bg-brand-primary/[0.04] dark:hover:bg-brand-primary/10 hover:border-brand-primary dark:hover:border-brand-primary transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm">
                          <QrCode size={22} className="text-brand-primary group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-brand-text dark:text-white group-hover:text-brand-primary transition-colors">
                              Scan Table QR
                            </span>
                            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50">
                              Recommended
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                            Fastest way to start ordering
                          </p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white dark:bg-brand-dark-bg border border-gray-200 dark:border-brand-dark-border flex items-center justify-center text-gray-400 group-hover:text-brand-primary group-hover:border-brand-primary group-hover:translate-x-0.5 transition-all shadow-sm">
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  </div>

                  {/* 3. Elegant Divider */}
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-brand-dark-border" />
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.25em]">
                      ──────── OR CONTINUE MANUALLY ────────
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-brand-dark-border" />
                  </div>

                  {/* 4. Table Selection Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                        <UtensilsCrossed size={12} className="text-brand-primary" />
                        <span>Select Restaurant Table</span>
                      </label>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400">
                        {totalTables} Tables Total
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                      {tableOptions.map((num) => {
                        const tableNumStr = String(num);
                        const isSelected = selectedTable === tableNumStr;
                        const state = getTableState(tableNumStr);
                        const isAvailable = state === 'available';
                        const isOccupied = state === 'occupied';
                        const isReserved = state === 'reserved';
                        const isCleaning = state === 'cleaning';
                        const isDisabled = !isAvailable;

                        let cardStyle = 'bg-white dark:bg-brand-dark-bg/80 border-gray-200 dark:border-brand-dark-border text-brand-text dark:text-white hover:border-brand-primary dark:hover:border-brand-primary hover:-translate-y-0.5 hover:shadow-md';
                        let statusBadge = { label: 'Available', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' };

                        if (isSelected) {
                          cardStyle = 'border-2 border-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-primary-light shadow-md shadow-brand-primary/15 -translate-y-0.5 scale-[1.02]';
                          statusBadge = { label: 'Selected', dot: 'bg-brand-primary', text: 'text-brand-primary dark:text-brand-primary-light font-extrabold' };
                        } else if (isOccupied) {
                          cardStyle = 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-400 cursor-not-allowed opacity-60';
                          statusBadge = { label: 'Occupied', dot: 'bg-rose-500', text: 'text-rose-500' };
                        } else if (isReserved) {
                          cardStyle = 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-500 cursor-not-allowed opacity-60';
                          statusBadge = { label: 'Reserved', dot: 'bg-amber-500', text: 'text-amber-600' };
                        } else if (isCleaning) {
                          cardStyle = 'bg-gray-100 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/40 text-gray-400 cursor-not-allowed opacity-60';
                          statusBadge = { label: 'Cleaning', dot: 'bg-gray-400', text: 'text-gray-400' };
                        }

                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => !isDisabled && handleTableChange(tableNumStr)}
                            disabled={isDisabled}
                            aria-label={`Select Table T-${num}`}
                            className={`relative min-h-[64px] p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${cardStyle}`}
                          >
                            {/* Selected Badge */}
                            {isSelected && (
                              <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-brand-primary text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">
                                <Check size={8} strokeWidth={3} />
                              </span>
                            )}

                            {/* Table Icon & Number */}
                            <div className="flex items-center gap-1 mt-0.5">
                              <UtensilsCrossed size={12} className={isSelected ? 'text-brand-primary dark:text-brand-primary-light' : 'text-gray-400'} />
                              <span className="text-xs font-black tracking-tight">T-{num}</span>
                            </div>

                            {/* Status label */}
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                              <span className={`text-[9px] font-bold ${statusBadge.text}`}>{statusBadge.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Selected Table Preview Summary Card */}
                  <AnimatePresence>
                    {selectedTable && isValidTable(selectedTable) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-primary/10 via-rose-500/10 to-brand-primary/5 border border-brand-primary/30 flex items-center justify-between shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-md shadow-brand-primary/20 shrink-0">
                            <CheckCircle2 size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-brand-primary dark:text-brand-primary-light">
                                ✓ Table Selected
                              </span>
                              <span className="text-[10px] font-black text-white bg-brand-primary px-2 py-0.5 rounded-full">
                                Table: T-{selectedTable}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300 mt-0.5">
                              Ready to start ordering
                            </p>
                          </div>
                        </div>

                        {/* Optional QR preview thumbnail */}
                        {qrDataUrl && (
                          <div className="w-10 h-10 bg-white rounded-lg p-0.5 border border-brand-primary/30 shadow-sm shrink-0">
                            <img src={qrDataUrl} alt="Table QR" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 6. Start Order Button */}
                  <button
                    type="button"
                    onClick={handleStartOrder}
                    disabled={!isStartEnabled}
                    aria-label={isStartEnabled ? "Start Ordering" : "Select a table first"}
                    className={`w-full font-black py-4 px-6 rounded-2xl text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                      isStartEnabled
                        ? 'bg-brand-primary hover:bg-brand-primary-dark text-white shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:scale-[1.01] active:scale-[0.98]'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{isStartEnabled ? 'Start Ordering' : 'Select a table first'}</span>
                    <ArrowRight size={18} className={`transition-transform duration-300 ${isStartEnabled ? 'group-hover:translate-x-1' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
                <ShieldCheck size={14} className="text-brand-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Contactless • Instant • Fresh Brewing</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanResult}
      />
    </section>
  );
};

export default HeroSection;