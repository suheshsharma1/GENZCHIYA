<<<<<<< HEAD
import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
=======
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ArrowRight, Sparkles, Coffee, Clock, ShieldCheck, Ticket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SVGLogo } from '../components/SVGLogo';
import QRCode from 'qrcode';
>>>>>>> 3bfde6a83394ca5a5be3b9f0e32219f64800844d

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-brand-bg overflow-x-hidden selection:bg-brand-primary selection:text-white">
      <Navbar />

<<<<<<< HEAD
      <main>
        <HeroSection />
=======
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 z-10 w-full max-w-5xl mx-auto">
        {/* Welcome Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-amber/15 text-brand-amber font-semibold text-xs border border-brand-amber/20 mb-5"
        >
          <Sparkles size={12} className="animate-spin-slow" />
          <span>Welcome to GENZCHIYA</span>
        </motion.div>

        {/* Two-Column Layout: QR Card (left) + Action Panel (right) */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">

          {/* LEFT: Premium QR Card — always visible */}
          <div className="flex flex-col items-center gap-3">
            <QRPreviewCard tableNumber={activeTable || null} />
            {activeTable && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9px] font-bold uppercase tracking-widest text-brand-emerald/60"
              >
                ✓ Table detected from QR scan
              </motion.p>
            )}
          </div>

          {/* RIGHT: Headline + Action Panel */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-sm w-full">
            {/* Hero Headline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-3"
            >
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-brand-emerald dark:text-white font-brand-serif">
                Where Every Sip <br />
                Creates a Memory{' '}
                <span className="text-brand-amber">GENZCHIYA</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Experience a smarter way to enjoy your favourite tea and snacks.
                Scan the QR code at your table, browse the digital menu, and order
                contactlessly.
              </p>
            </motion.div>

            {/* Action card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/80 dark:bg-brand-dark-card/85 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-brand-sage/5 dark:border-brand-dark-border w-full"
            >
              {activeTable ? (
                /* Table already detected — direct CTA */
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest font-bold text-brand-sage dark:text-brand-amber">
                    Table #{activeTable} — Ready!
                  </p>
                  <button
                    onClick={() => handleStartOrdering(activeTable)}
                    className="w-full bg-brand-emerald dark:bg-brand-amber hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>View Digital Menu</span>
                    <ArrowRight size={18} />
                  </button>
                  {/* Only offer table-change if there's no active order */}
                  {currentOrderId ? (
                    <button
                      onClick={() => navigate(`/tracking/${currentOrderId}`)}
                      className="w-full text-xs font-bold text-brand-emerald dark:text-brand-amber underline underline-offset-2 text-center cursor-pointer"
                    >
                      Track your current order →
                    </button>
                  ) : (
                    <button
                      onClick={() => { setTable(''); startNewSession(); }}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-full text-center"
                    >
                      Not at Table #{activeTable}? Choose another
                    </button>
                  )}
                </div>
              ) : !showScanner ? (
                <div className="space-y-5">
                  {/* Scan QR Button */}
                  <button
                    onClick={() => setShowScanner(true)}
                    className="w-full bg-brand-emerald hover:bg-brand-sage text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-emerald/15 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <QrCode size={20} className="group-hover:rotate-6 transition-transform" />
                    <span>Scan Table QR Code</span>
                  </button>

                  <div className="relative flex py-1 items-center justify-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-brand-dark-border" />
                    <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Or Select Manually
                    </span>
                    <div className="flex-grow border-t border-slate-200 dark:border-brand-dark-border" />
                  </div>

                  {/* Manual Form */}
                  <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={tableInput}
                      onChange={(e) => setTableInput(e.target.value)}
                      placeholder="Enter Table No."
                      required
                      className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 outline-none transition-all text-sm font-medium dark:text-white"
                    />
                    <button
                      type="submit"
                      className="bg-brand-amber hover:bg-brand-gold text-white font-bold px-6 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-brand-amber/15 cursor-pointer"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </div>
              ) : (
                /* QR Scanner Simulator */
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Table QR Scanner
                    </span>
                    <button
                      onClick={() => { setShowScanner(false); setScanStatus('idle'); }}
                      className="text-xs font-bold text-rose-400 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Camera viewfinder */}
                  <div className="relative aspect-square max-w-[240px] mx-auto rounded-2xl border-2 border-brand-emerald dark:border-brand-amber overflow-hidden bg-slate-950 flex flex-col justify-center items-center">
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-brand-amber rounded-tl-md" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-brand-amber rounded-tr-md" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-brand-amber rounded-bl-md" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-brand-amber rounded-br-md" />

                    {scanStatus === 'idle' && (
                      <div className="text-center p-4 space-y-4">
                        <QrCode size={48} className="text-slate-500 mx-auto" />
                        <button
                          onClick={handleSimulateScan}
                          className="bg-brand-emerald hover:bg-brand-sage text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-all shadow-md cursor-pointer"
                        >
                          Initialize Camera Feed
                        </button>
                      </div>
                    )}

                    {scanStatus === 'scanning' && (
                      <div className="relative w-full h-full flex flex-col justify-center items-center">
                        <div className="absolute left-0 w-full h-0.5 bg-brand-amber/80 shadow-md shadow-brand-amber animate-bounce top-1/4" />
                        <div className="text-center space-y-3 z-10">
                          <QrCode size={48} className="text-brand-amber mx-auto animate-pulse" />
                          <p className="text-[11px] text-slate-300 font-semibold tracking-wider uppercase animate-pulse">
                            Align QR within frame…
                          </p>
                        </div>
                      </div>
                    )}

                    {scanStatus === 'success' && (
                      <div className="text-center space-y-2">
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </motion.div>
                        <p className="text-xs text-slate-200 font-bold uppercase">
                          Table #{scannedTable} Decoded!
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 max-w-[240px] mx-auto leading-relaxed text-center">
                    Place table QR code inside scanner frame. Camera captures and decodes table session automatically.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Quick Info Pills */}
            <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Coffee size={12} className="text-brand-sage" />
                <span>Fresh Brewed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-brand-sage" />
                <span>Fast Prep</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-brand-sage" />
                <span>Contactless</span>
              </div>
            </div>

            {/* ── Saturday Ad Banner ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-r from-[#ff8a2b] via-[#ffb347] to-[#ffd25f] p-5 text-white shadow-[0_25px_70px_-24px_rgba(234,88,12,0.55)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),transparent_45%)]" />
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-brand-emerald/20 blur-2xl" />

                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-sm">
                      <Ticket size={12} />
                      Saturday Special
                    </div>
                    <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                      30% OFF All Items
                    </h3>
                    <p className="max-w-xl text-sm leading-relaxed text-white/90 sm:text-[15px]">
                      Enjoy amazing weekend savings on every tea, snack, and favorite dish. No extra code needed — the discount is already applied.
                    </p>
                  </div>

                  <div className="min-w-[150px] rounded-[1.2rem] border border-white/30 bg-white/15 p-3 text-center backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
                      This Saturday
                    </p>
                    <p className="text-3xl font-black leading-none">30%</p>
                    <p className="text-[11px] font-semibold text-white/90">OFF everything</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
>>>>>>> 3bfde6a83394ca5a5be3b9f0e32219f64800844d
      </main>
    </div>
  );
};

export default LandingPage;