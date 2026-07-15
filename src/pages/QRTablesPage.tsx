import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import {
  ArrowLeft, Printer, Download, QrCode, Plus, Minus, RefreshCw
} from 'lucide-react';
import { SVGLogo } from '../components/SVGLogo';

/* ─── Single Card Component ──────────────────────────────────────────────── */
interface TableCardProps {
  tableNumber: string;
  baseUrl: string;
}

const TableQRCard: React.FC<TableCardProps> = ({ tableNumber, baseUrl }) => {
  const [qrUrl, setQrUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Encode the correct customer-facing menu URL
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
      {/* Download button – only visible on hover, hidden on print */}
      <button
        onClick={handleDownload}
        title="Download QR image"
        className="print:hidden absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity
                   bg-brand-emerald text-white rounded-full p-1.5 shadow-md hover:bg-brand-sage cursor-pointer"
      >
        <Download size={12} />
      </button>

      {/* ── Card ── */}
      <div
        id={`qr-card-${tableNumber}`}
        className="
          bg-white border-2 border-[#1B3B2B]/20 rounded-3xl
          flex flex-col items-center text-center
          px-6 pt-6 pb-5
          shadow-sm hover:shadow-md transition-shadow duration-200
          break-inside-avoid
          w-[260px] mx-auto
          print:w-full print:shadow-none print:border-[#1B3B2B]
          print:rounded-2xl
        "
        style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
      >
        {/* Logo */}
        <div className="mb-2">
          <SVGLogo variant="full" size={38} />
        </div>

        {/* Thin decorative line */}
        <div className="w-16 h-px bg-[#D4A373]/40 mb-4" />

        {/* Table label */}
        <p className="text-[10px] font-extrabold tracking-[0.3em] text-[#D4A373] uppercase mb-0.5">
          Table Number
        </p>

        {/* Table number */}
        <h2
          className="text-5xl font-black text-[#1B3B2B] leading-none mb-4"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          #{tableNumber}
        </h2>

        {/* QR Code */}
        <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-inner mb-4">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt={`Table ${tableNumber} QR Code`}
              className="w-40 h-40 block"
              draggable={false}
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-slate-50 rounded-xl">
              <div className="flex flex-col items-center gap-1.5 text-slate-300">
                <QrCode size={32} strokeWidth={1} />
                <span className="text-[9px] font-medium">Generating…</span>
              </div>
            </div>
          )}
        </div>

        {/* Scan to Order */}
        <p className="text-[10px] font-black tracking-[0.25em] text-[#1B3B2B] uppercase mb-1">
          Scan to Order
        </p>
        <p className="text-[9px] text-slate-400 leading-relaxed max-w-[190px]">
          Scan this code using your phone camera or Viber/WhatsApp scanner to browse
          the digital menu and place your order instantly.
        </p>

        {/* Footer steps */}
        <div className="mt-4 w-full border-t border-dashed border-slate-200 pt-3
                        flex justify-between items-center px-1">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">1. Scan QR</span>
          <span className="text-[8px] text-slate-200">|</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">2. Pay Digital</span>
          <span className="text-[8px] text-slate-200">|</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">3. Enjoy Tea</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
const QRTablesPage: React.FC = () => {
  const navigate = useNavigate();
  const [tableCount, setTableCount] = useState(25);
  const baseUrl = window.location.origin;

  const tables = Array.from({ length: tableCount }, (_, i) => String(i + 1));

  return (
    <>
      {/* ── Print-only global CSS injected via <style> ── */}
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=Poppins:wght@400;600;700;800;900&display=swap');
      `}</style>

      <div className="min-h-screen bg-slate-50 dark:bg-brand-dark-bg transition-colors pb-24 text-slate-800 dark:text-slate-100 print:bg-white print:pb-0">

        {/* ── Sticky header ── */}
        <header className="print:hidden sticky top-0 z-40 bg-white/90 dark:bg-brand-dark-card/90 backdrop-blur-md border-b border-slate-200 dark:border-brand-dark-border shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            {/* Back */}
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-emerald dark:text-brand-amber
                         hover:bg-brand-emerald/10 dark:hover:bg-brand-amber/10 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Cashier
            </button>

            {/* Title */}
            <div className="text-center">
              <h1 className="font-extrabold text-sm uppercase tracking-widest">
                Printable Table QR Cards
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Place these on each table — customers scan to order
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Table count control */}
              <div className="flex items-center gap-1 border border-slate-200 dark:border-brand-dark-border rounded-xl overflow-hidden text-xs font-bold">
                <button
                  onClick={() => setTableCount(c => Math.max(1, c - 1))}
                  className="px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Remove table"
                >
                  <Minus size={12} />
                </button>
                <span className="px-2 text-brand-emerald dark:text-brand-amber tabular-nums min-w-[4ch] text-center">
                  {tableCount}
                </span>
                <button
                  onClick={() => setTableCount(c => Math.min(50, c + 1))}
                  className="px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Add table"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Print */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-brand-emerald hover:bg-brand-sage text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors cursor-pointer"
              >
                <Printer size={13} />
                Print All
              </button>
            </div>
          </div>
        </header>

        {/* ── Instruction strip ── */}
        <div className="print:hidden max-w-3xl mx-auto px-6 py-5">
          <div className="bg-brand-emerald/5 dark:bg-brand-amber/5 border border-brand-emerald/15 dark:border-brand-amber/15 rounded-2xl px-5 py-4 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-4 items-start">
            <div className="flex items-start gap-2.5 flex-1 min-w-[200px]">
              <QrCode size={16} className="text-brand-emerald dark:text-brand-amber shrink-0 mt-0.5" />
              <p>Each card encodes <code className="bg-slate-100 dark:bg-white/10 px-1 rounded text-[10px]">{baseUrl}/menu?table=N</code> so scanning takes customers straight to the menu with the table pre-selected.</p>
            </div>
            <div className="flex items-start gap-2.5 flex-1 min-w-[200px]">
              <Printer size={16} className="text-brand-emerald dark:text-brand-amber shrink-0 mt-0.5" />
              <p>Press <kbd className="bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded border text-[9px] font-mono shadow-sm">Ctrl+P</kbd> or click <strong>Print All</strong> to send cards to your printer. Prints 2-per-row on A4.</p>
            </div>
          </div>
        </div>

        {/* ── Cards grid ── */}
        <main className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 print:grid-cols-2 print:gap-12">
            {tables.map(t => (
              <TableQRCard key={t} tableNumber={t} baseUrl={baseUrl} />
            ))}
          </div>
        </main>

      </div>
    </>
  );
};

export default QRTablesPage;
