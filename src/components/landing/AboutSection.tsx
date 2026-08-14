import React from 'react';
import { motion } from 'framer-motion';
import {
  Coffee, Smartphone, Zap, ShieldCheck, Clock,
  Sparkles, CheckCircle2, Heart, Flame
} from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Smartphone,
    title: 'Scan or Select Table',
    subtitle: 'Table QR / Manual Selection',
    description: 'Scan the QR code on your café table using your phone camera, or choose your table number manually in seconds.',
    color: 'from-amber-500 to-orange-500',
    badge: 'Step 1'
  },
  {
    step: '02',
    icon: Coffee,
    title: 'Customize Your Drink',
    subtitle: 'Sugar, Milk & Flavoring Options',
    description: 'Browse our full digital menu. Pick your favorite Matka Chai, Coffee, or Cold Drink, and customize your sugar, milk & add-ons.',
    color: 'from-brand-primary to-rose-600',
    badge: 'Step 2'
  },
  {
    step: '03',
    icon: Zap,
    title: 'Instant Kitchen Prep',
    subtitle: 'Zero Queue & Freshly Served',
    description: 'Your order is sent directly to the kitchen display screen instantly. Sit back and enjoy as fresh piping hot tea arrives at your table!',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Step 3'
  }
];

const highlights = [
  {
    icon: Clock,
    title: 'Zero Waiting Queue',
    description: 'Order directly from your seat without standing in long cashier lines.',
    tag: 'Convenience'
  },
  {
    icon: Flame,
    title: 'Authentic Matka Tea',
    description: 'Slow-brewed chai cooked in traditional earthen clay pots for rich flavor.',
    tag: 'Signature'
  },
  {
    icon: CheckCircle2,
    title: '100% Accurate Orders',
    description: 'Custom sugar & milk choices go straight to the barista with zero communication mix-ups.',
    tag: 'Quality'
  },
  {
    icon: ShieldCheck,
    title: 'Contactless & Safe',
    description: 'Modern digital ordering experience designed for speed, hygiene and convenience.',
    tag: 'Safety'
  },
  {
    icon: Sparkles,
    title: 'Live Order Tracking',
    description: 'Track your tea status in real-time — from kitchen prep to table serving.',
    tag: 'Smart Tech'
  },
  {
    icon: Heart,
    title: 'Nepalese Hospitality',
    description: 'Warm, cozy atmosphere paired with modern smart technology.',
    tag: 'Experience'
  }
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">

      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brand-emerald/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16 relative"
      >
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-extrabold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
          <Sparkles size={14} />
          About GENZCHIYA
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Smart Tea Café{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-rose-500 to-amber-500">
            Ordering Experience
          </span>
        </h1>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          GENZCHIYA is Nepal’s premier smart tea café system. We blend authentic traditional chai culture with modern QR technology — giving you zero wait time, effortless order customization, and instant service straight to your table.
        </p>
      </motion.div>

      {/* ── Section 1: How It Works (3 Steps) ── */}
      <div className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-xs font-black text-brand-emerald dark:text-brand-amber uppercase tracking-[0.25em]">
            Simple &amp; Fast Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            How Ordering Works in 3 Easy Steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            return (
              <motion.div
                key={stepItem.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="relative bg-white dark:bg-brand-dark-card rounded-3xl p-7 border border-slate-200/80 dark:border-brand-dark-border shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${stepItem.color} text-white flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                    {stepItem.badge}
                  </span>
                </div>

                <span className="text-xs font-extrabold text-brand-primary uppercase tracking-wider block mb-1">
                  {stepItem.subtitle}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {stepItem.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Section 2: Why Choose GENZCHIYA ── */}
      <div className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-xs font-black text-brand-primary uppercase tracking-[0.25em]">
            Why GENZCHIYA?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Built for Chai Lovers &amp; Modern Cafés
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-brand-dark-card rounded-2xl p-6 border border-slate-100 dark:border-brand-dark-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;