import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Check, Clock,
  Coffee, Leaf, Zap, ScanLine
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
      color: { dark: '#1A1A1A', light: '#FFFFFF' },
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

  return (
    <section className="relative min-h-screen bg-brand-bg overflow-hidden font-sans">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/[0.015] rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Small Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/[0.08] border border-brand-primary/15"
            >
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.2em]">
                Where Every Sip Creates a Memory
              </span>
            </motion.div>

            {/* Large Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-1"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-brand-text">
                ORDER
                <br />
                <span className="text-brand-primary">SMARTER.</span>
                <br />
                <span className="text-gray-400">NOT HARDER.</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg font-medium"
            >
              Scan, select your table,
              and enjoy your favorite tea
              with zero waiting time.
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
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-primary/20 hover:scale-105 transition-all duration-300 cursor-default"
                >
                  <item.icon size={14} className="text-brand-primary" />
                  <span className="text-[10px] font-bold text-brand-text uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </motion.div>

            </motion.div>

          {/* Right Column - Premium Order Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            {/* Main Order Card */}
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Card with glassmorphism */}
              <div className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-premium-lg border border-white/60 overflow-hidden">

                {/* Red Gradient Header */}
                <div className="bg-gradient-to-br from-brand-primary to-brand-primary-dark px-6 py-5 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full" />
                    <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-white rounded-full" />
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Coffee size={18} className="text-white/80" />
                      <h3 className="text-lg font-black text-white tracking-tight">DINE IN</h3>
                    </div>
                    <p className="text-[10px] font-semibold text-white/70 uppercase tracking-[0.2em]">Select Your Table To Start</p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Error Message */}
                  {tableError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-white">!</span>
                      </div>
                      <p className="text-xs font-semibold text-red-600">{tableError}</p>
                    </motion.div>
                  )}

                  {/* Choose Table Label */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">
                      CHOOSE YOUR TABLE
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {tableOptions.map((num) => {
                        const tableNumStr = String(num);
                        const isSelected = selectedTable === tableNumStr;
                        const isOccupied = getTableStatus(tableNumStr) === 'occupied';
                        return (
                          <button
                            key={num}
                            onClick={() => !isOccupied && handleTableChange(tableNumStr)}
                            disabled={isOccupied}
                            className={`relative h-14 rounded-2xl text-xs font-black border-2 transition-all duration-200 cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/25 scale-105'
                                : isOccupied
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                                  : 'bg-white text-brand-text border-gray-200 hover:border-brand-primary hover:shadow-md hover:scale-105'
                            }`}
                          >
                            {isSelected && <Check size={14} className="absolute top-1.5 right-1.5" />}
                            {isOccupied && (
                              <span className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-[14px]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                              </span>
                            )}
                            <span className={isOccupied ? 'opacity-30' : ''}>T-{num}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* QR Scan Card */}
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-brand-primary hover:bg-brand-primary/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                      <ScanLine size={18} className="text-brand-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-brand-text">Scan Table QR Code</p>
                      <p className="text-[10px] text-gray-400 font-medium">Fastest Way To Order</p>
                    </div>
                  </button>

                  {/* QR Preview */}
                  {selectedTable && isValidTable(selectedTable) && qrDataUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl p-1 border border-gray-100 shadow-sm animate-qr-pulse">
                        <img src={qrDataUrl} alt="Table QR" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-text uppercase tracking-wider">Table {selectedTable}</p>
                        <p className="text-[10px] text-gray-400">Ready to order</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Start Order Button */}
                  <button
                    onClick={handleStartOrder}
                    disabled={!isStartEnabled}
                    className={`w-full font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isStartEnabled
                        ? 'bg-brand-primary hover:bg-brand-primary-dark text-white shadow-xl shadow-brand-primary/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>START ORDER</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Trust badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Secure • Fast • Contactless</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Saturday Offer Banner */}
      <div className="mt-16">
        <SaturdayOfferBanner />
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