import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const specials = [
  {
    name: 'Masala Chiya',
    description: 'Spiced tea with cardamom, cinnamon & ginger',
    price: '80',
    badge: 'Popular',
    badgeColor: 'bg-brand-primary',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
  },
  {
    name: 'Matka Chiya',
    description: 'Traditional clay pot brewed milk tea',
    price: '100',
    badge: 'Best Seller',
    badgeColor: 'bg-brand-accent',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
  },
  {
    name: 'Green Tea',
    description: 'Premium Japanese sencha, fresh & aromatic',
    price: '90',
    badge: 'New',
    badgeColor: 'bg-emerald-600',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
  },
  {
    name: 'Chai Latte',
    description: 'Smooth espresso-style chai with steamed milk',
    price: '110',
    badge: 'Trending',
    badgeColor: 'bg-rose-500',
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop',
  },
];

export const FeaturedSpecials: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent/[0.03] rounded-full blur-[100px]" />
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
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-brand-text mt-3 font-brand-serif">
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
          {specials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * index }}
              whileHover={{ y: -6 }}
              className="group bg-brand-bg rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-primary/10 transition-all duration-300 cursor-pointer"
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
                <div className={`absolute top-3 left-3 ${item.badgeColor} text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full`}>
                  {item.badge}
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Star size={10} className="text-brand-accent fill-brand-accent" />
                  <span className="text-[10px] font-bold text-brand-text">4.8</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-black text-brand-text tracking-tight">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-brand-primary">Rs. {item.price}</span>
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <ArrowRight size={14} className="text-brand-primary group-hover:text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpecials;