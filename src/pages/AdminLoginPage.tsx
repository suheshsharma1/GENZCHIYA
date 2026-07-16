import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SVGLogo } from '../components/SVGLogo';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginStaff, activeTable } = useApp();

  const [role, setRole] = useState<'cashier' | 'kitchen'>('cashier');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin Credentials validation check
    const isValidUsername = username.trim() === role;
    const isValidPassword = password === 'chiya123';

    if (isValidUsername && isValidPassword) {
      setLoading(true);
      setTimeout(() => {
        loginStaff(role);
        setLoading(false);
        if (role === 'cashier') {
          navigate('/admin');
        } else {
          navigate('/kitchen');
        }
      }, 1200);
    } else {
      setError('Invalid username or password. (Hint: Use role name as username and password "chiya123")');
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 flex flex-col justify-between overflow-x-hidden">
      
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-10">
        <button 
          onClick={() => navigate(`/menu?table=${activeTable || '1'}`)}
          className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-brand-sage dark:text-brand-mint cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft size={16} />
          <span>Back to Menu</span>
        </button>
        <SVGLogo variant="icon" size={32} />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 w-full z-10">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-brand-dark-card rounded-3xl p-6 shadow-xl border border-brand-sage/5 dark:border-brand-dark-border"
        >
          {/* Form Header */}
          <div className="text-center mb-6 space-y-2">
            <SVGLogo size={42} className="mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-1">Cashier Portal Login</h3>
            <p className="text-xs text-slate-400">Input terminal authorization keys to access cashier panel.</p>
          </div>

          {/* Feedback Info Box */}
          <div className="p-3 bg-brand-amber/10 text-brand-amber border border-brand-amber/20 rounded-xl mb-4 text-[10px] text-left leading-normal flex gap-1.5 items-start">
            <Sparkles size={14} className="shrink-0 mt-0.5" />
            <p>
              Testing credentials: Use username <span className="font-bold font-mono">"{role}"</span> and password <span className="font-bold font-mono">"chiya123"</span>.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-xs text-left mb-4 flex gap-1.5 items-start">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`E.g., ${role}`}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage outline-none text-xs font-semibold dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage outline-none text-xs font-semibold dark:text-white tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-emerald dark:bg-brand-amber text-white dark:text-brand-dark-bg hover:bg-brand-sage dark:hover:bg-brand-gold font-extrabold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading Terminal...</span>
                </>
              ) : (
                "Enter Cashier Portal"
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-brand-dark-border/40 bg-white/20 dark:bg-black/10">
        GENZCHIYA Smart Tea Café Systems &copy; {new Date().getFullYear()}
      </footer>

    </div>
  );
};
export default AdminLoginPage;
