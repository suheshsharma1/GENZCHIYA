import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { products } from '../../data/products';

const CATEGORY_LABELS: Record<string, string> = {
  tea: '🍵 Tea',
  coffee: '☕ Coffee',
  'cold-drinks': '🥤 Cold Drinks',
};

const CATEGORY_ORDER = ['tea', 'coffee', 'cold-drinks'];

const CATEGORY_GRADIENT: Record<string, string> = {
  tea: 'from-emerald-500/20 via-teal-400/10 to-transparent',
  coffee: 'from-amber-600/20 via-orange-400/10 to-transparent',
  'cold-drinks': 'from-sky-500/20 via-blue-400/10 to-transparent',
};

const CATEGORY_BADGE: Record<string, string> = {
  tea: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  coffee: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  'cold-drinks': 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
};

const grouped = CATEGORY_ORDER.reduce<Record<string, typeof products>>((acc, cat) => {
  acc[cat] = products.filter((p) => p.category === cat);
  return acc;
}, {});

const allProducts = CATEGORY_ORDER.flatMap((cat) => grouped[cat]);

const TABS = [
  { key: 'all', label: '✨ All' },
  { key: 'tea', label: '🍵 Tea' },
  { key: 'coffee', label: '☕ Coffee' },
  { key: 'cold-drinks', label: '🥤 Drinks' },
];

export const GallerySection: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProducts =
    activeCategory === 'all'
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  const openLightbox = (product: typeof products[0]) => {
    const idx = filteredProducts.findIndex((p) => p.id === product.id);
    setLightboxIndex(idx);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredProducts.length);
  };

  const currentProduct = lightboxIndex !== null ? filteredProducts[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-12 px-2 sm:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mb-7"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            <Images size={11} />
            Menu Gallery
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
          Our{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-emerald">
            Drinks
          </span>{' '}
          &amp; Specials
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 max-w-sm">
          Click any item to see its full details. All photos are of our real menu.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="flex flex-wrap gap-1.5 mb-5"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 ${
              activeCategory === tab.key
                ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/25'
                : 'bg-white dark:bg-brand-dark-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-brand-dark-border hover:border-brand-primary/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto self-center text-[10px] text-slate-400 font-medium">
          {filteredProducts.length} items
        </span>
      </motion.div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-3 sm:grid-cols-4 gap-2.5"
      >
        <AnimatePresence>
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, delay: i * 0.025 }}
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => openLightbox(product)}
              className="group relative cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-brand-dark-card border border-slate-100 dark:border-brand-dark-border shadow-sm hover:shadow-lg hover:shadow-black/10 transition-all duration-300"
            >
              {/* Square image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://placehold.co/200x200/f1f5f9/94a3b8?text=${encodeURIComponent(product.name)}`;
                  }}
                />
              </div>

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                <p className="text-white text-[10px] font-black leading-tight truncate">{product.name}</p>
                <p className="text-white/70 text-[9px] mt-0.5 font-medium">Rs. {product.price}</p>
              </div>

              {/* Category dot */}
              <div
                className={`absolute top-1.5 left-1.5 text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full border backdrop-blur-sm ${
                  CATEGORY_BADGE[product.category]
                }`}
              >
                {product.category === 'cold-drinks' ? '🥤' : product.category === 'tea' ? '🍵' : '☕'}
              </div>

              {/* Name below */}
              <div className="px-2 py-1.5">
                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {product.name}
                </p>
                <p className="text-[9px] text-slate-400 font-medium">Rs. {product.price}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {currentProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm w-full bg-white dark:bg-brand-dark-card rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://placehold.co/400x300/f1f5f9/94a3b8?text=${encodeURIComponent(currentProduct.name)}`;
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${CATEGORY_GRADIENT[currentProduct.category]}`} />

                {/* Close */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-1.5 rounded-full transition-colors"
                >
                  <X size={15} />
                </button>

                {/* Arrows */}
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-1.5 rounded-full transition-colors"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-1.5 rounded-full transition-colors"
                >
                  <ChevronRight size={17} />
                </button>

                {/* Counter */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {(lightboxIndex ?? 0) + 1} / {filteredProducts.length}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${CATEGORY_BADGE[currentProduct.category]}`}>
                      {CATEGORY_LABELS[currentProduct.category]}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                      {currentProduct.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-brand-primary">Rs. {currentProduct.price}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Starting price</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
