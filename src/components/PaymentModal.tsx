import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Phone, Key, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mobileNumber: string) => void;
  amount: number;
  orderId: string;
  provider: 'khalti' | 'esewa';
}

type PaymentStep = 'credentials' | 'otp' | 'processing' | 'success';

const PROVIDER_CONFIG = {
  khalti: {
    color: '#5C2D91',
    colorDark: '#4C247B',
    colorDarker: '#3D1D63',
    name: 'khalti',
    label: 'Wallet',
    mobileLabel: 'Khalti Mobile Number',
    pinLabel: 'Khalti MPIN',
    placeholder: '98XXXXXXXX',
    pinPlaceholder: '••••',
    successText: 'Paid via Khalti Wallet',
    submitText: 'Pay',
    processingText: 'Connecting to Wallet...',
  },
  esewa: {
    color: '#E85D04',
    colorDark: '#C24D03',
    colorDarker: '#9C3D02',
    name: 'esewa',
    label: 'Wallet',
    mobileLabel: 'Esewa Mobile Number',
    pinLabel: 'Esewa PIN',
    placeholder: '98XXXXXXXX',
    pinPlaceholder: '••••',
    successText: 'Paid via Esewa Wallet',
    submitText: 'Pay',
    processingText: 'Connecting to Wallet...',
  }
};

/*
 * LIVE PAYMENT INTEGRATION (backend required)
 *
 * This modal is currently a frontend simulation for demo purposes.
 * To connect real Khalti / eSewa payments:
 *
 * 1. Add a backend endpoint (e.g. /api/verify-payment) that:
 *    - Receives: provider, amount, orderId, mobileNumber, transactionId
 *    - Calls the provider's verify API using the SECRET KEY (server-side only)
 *    - Returns: { success: boolean, transactionId?: string, status?: string }
 *
 * 2. In this modal, replace the setTimeout simulations with:
 *    const res = await fetch('/api/verify-payment', { method: 'POST', body: JSON.stringify({...}) })
 *    const data = await res.json()
 *    if (data.success) { onSuccess(mobileNumber) }
 *
 * 3. Environment variables (server-side / backend only):
 *    KHALTI_MERCHANT_ID, KHALTI_SECRET_KEY, KHALTI_VERIFY_URL
 *    ESEWA_MERCHANT_ID, ESEWA_SECRET_KEY, ESEWA_VERIFY_URL
 *
 * NEVER expose secret keys in frontend code or .env.local that is committed to Git.
 */
export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  orderId,
  provider
}) => {
  const [step, setStep] = useState<PaymentStep>('credentials');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mpin, setMpin] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = PROVIDER_CONFIG[provider];

  useEffect(() => {
    if (isOpen) {
      setStep('credentials');
      setMobileNumber('');
      setMpin('');
      setOtp('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mobileNumber.length !== 10 || !mobileNumber.startsWith('9')) {
      setError('Please enter a valid 10-digit Nepalese mobile number starting with 9.');
      return;
    }

    if (mpin.length !== 4) {
      setError(`Please enter your 4-digit ${config.name} PIN.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit confirmation code.');
      return;
    }

    setIsSubmitting(true);
    setStep('processing');

    setTimeout(() => {
      setStep('success');
      setIsSubmitting(false);
      setTimeout(() => {
        onSuccess(mobileNumber);
      }, 2000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl text-slate-800"
        >
          <div style={{ backgroundColor: config.color }} className="px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight">{config.name}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest border border-white/30 rounded px-1.5 py-0.5 bg-white/10">
                {config.label}
              </span>
            </div>
            {step !== 'success' && step !== 'processing' && (
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="p-6">
            {step === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="text-center mb-2">
                  <p className="text-sm text-slate-500">Order ID: <span className="font-semibold text-slate-700">{orderId}</span></p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">Rs. {amount.toLocaleString()}</h3>
                </div>

                {error && (
                  <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {config.mobileLabel}
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      maxLength={10}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder={config.placeholder}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#5C2D91] focus:ring-2 focus:ring-[#5C2D91]/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {config.pinLabel}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={mpin}
                      maxLength={4}
                      onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                      placeholder={config.pinPlaceholder}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#5C2D91] focus:ring-2 focus:ring-[#5C2D91]/20 outline-none transition-all text-sm tracking-widest"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: config.color }}
                  className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {config.processingText}
                    </>
                  ) : (
                    `${config.submitText} Rs. ${amount.toLocaleString()}`
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Secure 256-bit encrypted connection.</span>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                    <Key size={22} />
                  </div>
                  <h4 className="font-bold text-slate-800">Verification Code Sent</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the 6-digit confirmation code sent to <span className="font-semibold">{mobileNumber}</span>.
                  </p>
                </div>

                {error && (
                  <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block text-center">
                    One Time Password (OTP)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="1 2 3 4 5 6"
                    required
                    autoFocus
                    disabled={isSubmitting}
                    className="w-full text-center tracking-widest text-lg font-bold py-3 rounded-xl border border-slate-200 focus:border-[#5C2D91] focus:ring-2 focus:ring-[#5C2D91]/20 outline-none transition-all"
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 px-1">
                  <span>Didn't receive code?</span>
                  <button 
                    type="button" 
                    onClick={() => { setOtp(''); setError(''); }}
                    style={{ color: config.color }}
                    className="font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: config.color }}
                  className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying OTP...
                    </>
                  ) : (
                    "Verify & Confirm Payment"
                  )}
                </button>
              </form>
            )}

            {step === 'processing' && (
              <div className="py-8 text-center space-y-4">
                <Loader2 size={48} className="animate-spin mx-auto" style={{ color: config.color }} />
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Authorizing Transaction</h4>
                  <p className="text-xs text-slate-400 mt-1">Please do not refresh the page or click close.</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-6 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
                  <CheckCircle2 size={40} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xl">Payment Successful</h4>
                  <p className="text-xs text-slate-500 mt-1">Paid Rs. {amount.toLocaleString()} {config.successText}</p>
                </div>
                <div className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 p-2.5 rounded-lg inline-block text-left">
                  <p>Transaction ID: <span className="font-mono font-medium text-slate-700">TXN-{Math.floor(100000000 + Math.random() * 900000000)}</span></p>
                  <p className="mt-0.5">Reference: <span className="font-medium text-slate-700">{orderId}</span></p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
