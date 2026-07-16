import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  QrCode, Sparkles, Clock,
  Smartphone, CreditCard, ChefHat, BarChart3, Heart,
  Globe, Mail, Phone, MapPin, ArrowLeft
} from 'lucide-react';
import { SVGLogo } from '../components/SVGLogo';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: QrCode,
      title: 'QR Table Ordering',
      description: 'Scan QR codes at your table to instantly access the digital menu. No apps to download, no accounts required.',
      color: 'brand-emerald'
    },
    {
      icon: Smartphone,
      title: 'Contactless Experience',
      description: 'Browse menus, customize orders, and pay securely from your smartphone. Safe, fast, and hygienic.',
      color: 'brand-amber'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Integrated Khalti, Esewa, and cash payment options. Every transaction is encrypted and verified.',
      color: 'brand-sage'
    },
    {
      icon: ChefHat,
      title: 'Kitchen Display System',
      description: 'Real-time order routing to kitchen displays. Chefs see orders instantly with prep timers and batch summaries.',
      color: 'brand-gold'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Live sales dashboards, revenue tracking, and popular item analytics for data-driven decisions.',
      color: 'brand-emerald'
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Customers track order status live from pending to served. Transparent preparation times and notifications.',
      color: 'brand-amber'
    }
  ];

  const stats = [
    { value: '25+', label: 'Tables Supported' },
    { value: '48+', label: 'Menu Items' },
    { value: '< 3s', label: 'Order Processing' },
    { value: '100%', label: 'Digital Workflow' }
  ];

  return (
    <div className="relative min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-brand-sage dark:text-brand-mint hover:text-brand-amber transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Back</span>
        </button>
        <SVGLogo size={36} />
        <div className="w-16" />
      </header>

      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-amber/15 text-brand-amber font-semibold text-xs border border-brand-amber/20">
            <Sparkles size={12} />
            <span>About GENZCHIYA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-emerald dark:text-white font-brand-serif">
            Where Every Sip <br />
            Creates a Memory
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            GENZCHIYA is a premium smart tea café ordering system designed to transform the dining experience 
            through cutting-edge technology, seamless contactless ordering, and intelligent kitchen management.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-brand-dark-card rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-center">
              <div className="text-2xl font-black text-brand-emerald dark:text-brand-amber">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 md:p-8 shadow-xl border border-brand-sage/10 dark:border-brand-dark-border mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-amber/10 rounded-xl">
              <Heart size={24} className="text-brand-amber" />
            </div>
            <h2 className="text-xl font-black text-brand-emerald dark:text-white">Our Mission</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            At GENZCHIYA, we believe that great food and beverages should be accompanied by an equally great experience. 
            Our mission is to bridge the gap between traditional hospitality and modern technology. We empower cafés and 
            restaurants with intelligent ordering systems that reduce wait times, minimize errors, and delight customers 
            with contactless convenience. From QR-based table ordering to real-time kitchen displays and comprehensive 
            analytics, we deliver a complete ecosystem that elevates every touchpoint of the dining journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-black text-brand-emerald dark:text-white mb-6 text-center">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-slate-200/50 dark:border-brand-dark-border/40 text-left hover:shadow-md transition-shadow"
              >
                <div className={`p-2.5 bg-${feature.color}/10 rounded-xl w-fit mb-3`}>
                  <feature.icon size={22} className={`text-${feature.color}`} />
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 md:p-8 shadow-xl border border-brand-sage/10 dark:border-brand-dark-border mb-12"
        >
          <h2 className="text-2xl font-black text-brand-emerald dark:text-white mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Scan QR', desc: 'Customer scans table QR code with any smartphone camera.' },
              { step: '02', title: 'Order', desc: 'Browse menu, customize items, and place order securely.' },
              { step: '03', title: 'Confirm', desc: 'Cashier reviews order in popup and accepts for kitchen.' },
              { step: '04', title: 'Serve', desc: 'Kitchen prepares order, marks ready, and serves customer.' }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="text-3xl font-black text-brand-amber/30 font-mono">{item.step}</div>
                <h4 className="font-bold text-sm text-brand-emerald dark:text-brand-amber">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team / Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-brand-dark-card rounded-3xl p-6 md:p-8 shadow-xl border border-brand-sage/10 dark:border-brand-dark-border mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-emerald/10 rounded-xl">
              <Globe size={24} className="text-brand-emerald" />
            </div>
            <h2 className="text-xl font-black text-brand-emerald dark:text-white">Contact & Location</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-amber mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Location</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mid-Baneshwor, Kathmandu, Nepal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-brand-amber mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Phone</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">+977-9821562664</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-brand-amber mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Email</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">genzchiya@gmail.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="py-6 text-center border-t border-slate-200 dark:border-brand-dark-border/40">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
            GENZCHIYA Smart Lounge &copy; {new Date().getFullYear()}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Crafted with passion for smart hospitality
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AboutPage;
