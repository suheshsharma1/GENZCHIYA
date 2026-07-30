import React from 'react';
import { motion } from 'framer-motion';
import {
  Coffee, Smartphone, Table, Zap, CreditCard, LayoutDashboard,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Coffee,
    title: 'Digital Menu',
    description: 'Browse the complete tea menu digitally.',
    color: 'brand-emerald',
  },
  {
    icon: Smartphone,
    title: 'QR Table Ordering',
    description: 'Scan the table QR to begin ordering instantly.',
    color: 'brand-amber',
  },
  {
    icon: Table,
    title: 'Manual Table Selection',
    description: 'Customers can also choose their table manually.',
    color: 'brand-sage',
  },
  {
    icon: Zap,
    title: 'Fast Order Processing',
    description: 'Orders are sent instantly to the cashier.',
    color: 'brand-emerald',
  },
  {
    icon: CreditCard,
    title: 'Digital Payment Ready',
    description: 'Supports future integration with digital payment systems.',
    color: 'brand-amber',
  },
  {
    icon: LayoutDashboard,
    title: 'Staff Dashboard',
    description: 'Manage orders, tables, and menu items efficiently.',
    color: 'brand-sage',
  },
];

const stats = [
  { value: '10+', label: 'Cafe Tables' },
  { value: '20+', label: 'Tea Menu Items' },
  { value: '500+', label: 'Happy Customers' },
  { value: '1000+', label: 'Orders Served' },
];

export const AboutSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="relative bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[10px] font-black text-brand-emerald uppercase tracking-[0.3em]">
            About GENZCHIYA
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-3 font-brand-serif">
            Smart Tea Café Ordering System
          </h2>
          <p className="mt-6 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            GENZCHIYA is a smart tea café ordering platform designed to simplify the customer experience.
            Customers can scan a table QR code or select their table manually, browse the digital menu,
            customize their tea, and place orders without waiting in queues. The system helps cafés reduce
            ordering errors, improve service speed, and deliver a modern contactless dining experience.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 * index }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 hover:shadow-md hover:border-brand-emerald/20 dark:hover:border-brand-amber/20 transition-all duration-300 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 dark:bg-${feature.color}/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={22} className={`text-${feature.color} dark:text-${feature.color}`} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="bg-white dark:bg-brand-dark-card rounded-3xl p-8 md:p-12 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40"
        >
          <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-10">
            Our Impact
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-black text-brand-emerald dark:text-brand-amber font-brand-serif tracking-tight">
                  {stat.value}
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-2 bg-brand-emerald hover:bg-brand-sage dark:bg-brand-amber dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-extrabold py-3.5 px-8 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-brand-emerald/20 dark:shadow-brand-amber/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <span>Start Ordering</span>
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;