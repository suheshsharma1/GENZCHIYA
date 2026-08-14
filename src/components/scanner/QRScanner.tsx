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

        // Fetch available camera devices to support desktop laptops & webcams
        const devices = await Html5Qrcode.getCameras().catch(() => []);
        
        let config: string | { facingMode: string } = { facingMode: 'environment' };
        if (devices && devices.length > 0) {
          config = devices[0].id;
        }

        await scanner.start(
          config,
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            if (mounted) {
              onScan(decodedText);
            }
          },
          () => {}
        );
      } catch {
        // Fallback to user facing mode if environment or device id failed
        try {
          if (scannerRef.current && mounted) {
            await scannerRef.current.start(
              { facingMode: 'user' },
              { fps: 10, qrbox: { width: 200, height: 200 } },
              (decodedText) => {
                if (mounted) onScan(decodedText);
              },
              () => {}
            );
            return;
          }
        } catch (err) {
          if (mounted) {
            setError('Camera access denied or webcam unavailable on this device.');
            console.error(err);
          }
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

        <div id="qr-reader" className="w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center" style={{ minHeight: 250 }} />

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">{error}</p>
          </div>
        )}

        {/* Manual Table Number Quick Selection Fallback */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">
            Or select table number manually:
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center max-h-28 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tableNum) => (
              <button
                key={tableNum}
                onClick={() => {
                  handleClose();
                  onScan(`${window.location.origin}/menu?table=${tableNum}`);
                }}
                className="px-3 py-1.5 rounded-xl bg-brand-emerald/10 dark:bg-brand-amber/10 text-brand-emerald dark:text-brand-amber hover:bg-brand-emerald hover:text-white dark:hover:bg-brand-amber dark:hover:text-brand-dark-bg text-xs font-black transition-colors cursor-pointer"
              >
                Table #{tableNum}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
