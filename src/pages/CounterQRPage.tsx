import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { SVGLogo } from '../components/SVGLogo';

export const CounterQRPage: React.FC = () => {
  const navigate = useNavigate();
  const qrUrl = '/images/genzchiya-khalti-qr.png';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'genzchiya-khalti-qr.png';
    a.click();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark-bg flex flex-col items-center justify-center p-6 print:bg-white">
      {/* Header - hidden when printing */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-10 no-print">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-brand-sage dark:text-brand-mint hover:text-brand-amber transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Back to Dashboard</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-brand-emerald/10 hover:bg-brand-emerald/20 text-brand-emerald px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Download size={14} />
            Download
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-brand-emerald text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-brand-sage transition-colors"
          >
            <Printer size={14} />
            Print QR
          </button>
        </div>
      </div>

      {/* QR Card */}
      <div className="bg-white dark:bg-brand-dark-card rounded-3xl shadow-2xl border border-slate-200 dark:border-brand-dark-border p-8 max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <SVGLogo size={48} />
        </div>

        <h1 className="text-2xl font-black text-brand-emerald dark:text-white mb-1">
          GENZCHIYA
        </h1>
        <p className="text-xs font-bold text-brand-amber uppercase tracking-widest mb-6">
          Smart Tea Café — Counter Payment QR
        </p>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-4 border-2 border-brand-emerald/20 shadow-inner mb-6">
          <img
            src={qrUrl}
            alt="Khalti Payment QR Code"
            className="w-full h-auto max-w-[280px] mx-auto"
            draggable={false}
          />
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-left bg-brand-emerald/5 dark:bg-brand-emerald/10 rounded-xl p-4 border border-brand-emerald/10">
          <p className="text-xs font-bold text-brand-emerald dark:text-brand-amber uppercase tracking-wider mb-2">
            How to Pay
          </p>
          <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
            <p>1. Open your <strong>Khalti</strong> app</p>
            <p>2. Tap <strong>"Scan"</strong> and point at this QR</p>
            <p>3. Enter the <strong>amount</strong> shown in your order</p>
            <p>4. Confirm with your <strong>MPIN</strong></p>
          </div>
        </div>

        {/* Merchant Note */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-brand-dark-border">
          <p className="text-[10px] text-slate-400 font-medium">
            Merchant: GENZCHIYA Smart Lounge
          </p>
          <p className="text-[10px] text-slate-400">
            Gwarko · +977-9821562664
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[10px] text-slate-400 mt-6 no-print">
        Display this screen at the counter for customer payments
      </p>
    </div>
  );
};

export default CounterQRPage;
