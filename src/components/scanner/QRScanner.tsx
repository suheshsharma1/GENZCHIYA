import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScan }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isStoppingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current = null;
      }
    } catch {
      scannerRef.current = null;
    } finally {
      isStoppingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    let mounted = true;
    setError(null);

    const start = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (mounted) {
              onScan(decodedText);
            }
          },
          () => {}
        );
      } catch (err) {
        if (mounted) {
          setError('Camera access denied or unavailable.');
          console.error(err);
        }
      }
    };

    start();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [isOpen, onScan, stopScanner]);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Scan Table QR</h4>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div id="qr-reader" className="w-full rounded-2xl overflow-hidden bg-black" style={{ minHeight: 280 }} />

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <p className="mt-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 text-center">
          Point your camera at the QR code printed on your table
        </p>
      </div>
    </div>
  );
};
