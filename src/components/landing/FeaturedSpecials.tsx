import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const FeaturedSpecials: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useApp();
  const featuredProducts = products.filter(p => p.featured);

  return (
    <section className="relative bg-white dark:bg-brand-dark-bg transition-colors duration-300 py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/[0.02] dark:bg-brand-primary/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent/[0.03] dark:bg-brand-accent/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12"
        >
          <div>
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">
              Our Specials
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-brand-text dark:text-white mt-3 font-brand-serif">
              Featured Drinks
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-brand-primary font-bold text-sm hover:gap-3 transition-all duration-300 cursor-pointer"
          >
            View All Menu
            <ArrowRight size={16} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * index }}
              whileHover={{ y: -6 }}
              className="group bg-brand-bg dark:bg-brand-dark-card rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-brand-dark-border hover:shadow-lg hover:border-brand-primary/20 dark:hover:border-brand-primary/40 transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/menu')}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className={`absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full`}>
                  Featured
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-brand-dark-bg/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20 dark:border-brand-dark-border">
                  <Star size={10} className="text-brand-accent fill-brand-accent" />
                  <span className="text-[10px] font-bold text-brand-text dark:text-white">4.8</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-black text-brand-text dark:text-white tracking-tight">{item.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-brand-primary">Rs. {item.price}</span>
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <ArrowRight size={14} className="text-brand-primary group-hover:text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {featuredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              <p className="text-sm font-medium">No featured products available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpecials;
