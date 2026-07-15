import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Heart, Clock, ChevronRight, UserCheck, Star, Award, AwardIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SVGLogo } from '../components/SVGLogo';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, products, favorites, activeTable, toggleFavorite } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'favorites' | 'profile'>('history');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'tea' | 'snacks'>('all');

  // Local state for profile editor
  const [profileName, setProfileName] = useState(() => localStorage.getItem('gc_profile_name') || 'Guest Companion');
  const [profilePhone, setProfilePhone] = useState(() => localStorage.getItem('gc_profile_phone') || '9821562664');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('gc_profile_email') || 'genzchiya@gmail.com');
  const [editSuccess, setEditSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gc_profile_name', profileName);
    localStorage.setItem('gc_profile_phone', profilePhone);
    localStorage.setItem('gc_profile_email', profileEmail);
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 3000);
  };

  // Filter orders related to this session or mock orders
  const allCustomerOrders = orders.filter(
    o => o.customerName === profileName || o.customerPhone === profilePhone || o.customerPhone === '9841555666'
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply category filter to history
  const TEA_CATEGORIES = ['tea'];
  const SNACK_CATEGORIES = ['snacks-fries', 'momo'];

  const customerOrders = allCustomerOrders.filter(order => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'tea') return order.items.some(item => TEA_CATEGORIES.includes(item.product.category));
    if (historyFilter === 'snacks') return order.items.some(item => SNACK_CATEGORIES.includes(item.product.category));
    return true;
  });

  // Map favorite product IDs to actual product objects
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 pb-20 text-slate-800 dark:text-slate-100">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-brand-cream/80 dark:bg-brand-dark-bg/85 backdrop-blur-md border-b border-brand-sage/5 dark:border-brand-dark-border/40 px-4 py-3 flex justify-between items-center max-w-xl mx-auto">
        <button 
          onClick={() => navigate(`/menu?table=${activeTable || '1'}`)}
          className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-brand-sage dark:text-brand-mint cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-200">Customer Center</span>
        <div className="w-10" />
      </header>

      <main className="max-w-xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-emerald/10 dark:bg-brand-amber/15 text-brand-emerald dark:text-brand-amber flex items-center justify-center">
            <User size={28} />
          </div>
          <div className="text-left space-y-1">
            <h4 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>{profileName}</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-brand-amber/20 text-[9px] font-bold text-brand-amber border border-brand-amber/10">
                <Award size={10} />
                Gold Tier
              </span>
            </h4>
            <p className="text-xs text-slate-400 font-medium">Table Session: #{activeTable || 'None'}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white dark:bg-brand-dark-card rounded-xl p-1 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Order History ({customerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Favorites ({favoriteProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-brand-emerald text-white dark:bg-brand-amber dark:text-brand-dark-bg'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            My Details
          </button>
        </div>

        {/* Tab 1: Order History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {/* Category Filter Chips */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'tea', label: '🍵 Tea Only' },
                { key: 'snacks', label: '🍟 Snacks Only' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setHistoryFilter(key as 'all' | 'tea' | 'snacks')}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                    historyFilter === key
                      ? 'bg-brand-emerald text-white border-brand-emerald dark:bg-brand-amber dark:text-brand-dark-bg dark:border-brand-amber'
                      : 'bg-white dark:bg-brand-dark-card text-slate-500 dark:text-slate-400 border-slate-200 dark:border-brand-dark-border hover:border-brand-sage dark:hover:border-brand-amber'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {customerOrders.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-brand-dark-border/60">
                <Clock className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                <p className="text-slate-400 text-xs font-medium">No order history recorded yet.</p>
              </div>
            ) : (
              customerOrders.map((order) => {
                const isOngoing = ['pending', 'accepted', 'preparing', 'ready'].includes(order.status);
                
                return (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/tracking/${order.id}`)}
                    className="p-4 bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 flex justify-between items-center hover:shadow-md cursor-pointer transition-shadow"
                  >
                    <div className="text-left space-y-1.5 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">Invoice: {order.id}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          order.status === 'completed' || order.status === 'served'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : order.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-brand-amber animate-pulse'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="text-xs font-bold leading-tight">
                        {order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', ')}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs font-extrabold text-brand-emerald dark:text-brand-amber">
                          Rs. {order.total}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 ml-4 shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Favorites */}
        {activeTab === 'favorites' && (
          <div className="space-y-3">
            {favoriteProducts.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-brand-dark-border/60">
                <Heart className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                <p className="text-slate-400 text-xs font-medium">Your bookmarked items appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-brand-dark-card rounded-xl overflow-hidden border border-brand-sage/5 dark:border-brand-dark-border/40 shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-video">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-brand-dark-bg/85 backdrop-blur-sm text-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        <Heart size={12} fill="#f43f5e" />
                      </button>
                    </div>

                    <div className="p-3 text-left space-y-2 flex-1 flex flex-col justify-between">
                      <h5 className="font-bold text-xs line-clamp-1">{product.name}</h5>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[11px] font-extrabold text-brand-emerald dark:text-brand-amber">Rs. {product.price}</span>
                        <button
                          onClick={() => navigate(`/menu?table=${activeTable || '1'}`)}
                          className="bg-brand-emerald/10 dark:bg-brand-amber/15 text-brand-emerald dark:text-brand-amber font-bold text-[10px] px-2.5 py-1 rounded-lg hover:bg-brand-emerald hover:text-white dark:hover:bg-brand-amber dark:hover:text-brand-dark-bg cursor-pointer transition-colors"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Editor */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 text-left">Update Profile</h4>
            
            {editSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs font-semibold flex items-center justify-center gap-1.5">
                <UserCheck size={16} />
                <span>Profile details saved locally!</span>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage outline-none text-xs font-semibold dark:text-white"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
              <input
                type="tel"
                required
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage outline-none text-xs font-semibold dark:text-white"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-bg focus:border-brand-sage outline-none text-xs font-semibold dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-emerald dark:bg-brand-amber text-white dark:text-brand-dark-bg hover:bg-brand-sage dark:hover:bg-brand-gold font-extrabold py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        )}

      </main>
      
      {/* Footer Branding */}
      <div className="text-center py-6">
        <SVGLogo variant="icon" size={24} className="opacity-45" />
        <span className="block text-[8px] uppercase tracking-widest text-slate-400 dark:text-slate-600 mt-1">GENZCHIYA Smart Lounge</span>
      </div>

    </div>
  );
};
export default HistoryPage;
