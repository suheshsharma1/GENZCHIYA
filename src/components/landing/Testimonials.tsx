import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'Regular Customer',
    rating: 5,
    text: 'The QR ordering system is a game changer. No more waiting in line — just scan, order, and enjoy fresh tea at my table.',
    avatar: 'https://i.pravatar.cc/100?img=1',
  },
  {
    name: 'Priya Gurung',
    role: 'Tea Lover',
    rating: 5,
    text: 'GENZCHIYA makes every visit special. The matka chiya is always perfectly brewed and the contactless ordering is so convenient.',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    name: 'Rajan KC',
    role: 'First-time Visitor',
    rating: 5,
    text: 'I walked in not knowing what to expect and left as a regular. The tea quality is unmatched and the ordering experience is seamless.',
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
  {
    name: 'Sita Tamang',
    role: 'Daily Visitor',
    rating: 4,
    text: 'Love the Saturday special — 30% off on all tea items. The system is fast, clean, and the staff are always friendly.',
    avatar: 'https://i.pravatar.cc/100?img=9',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="relative bg-brand-bg dark:bg-brand-dark-bg transition-colors duration-300 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand-primary/[0.03] dark:bg-brand-primary/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand-accent/[0.04] dark:bg-brand-accent/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">
            What Our Customers Say
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-brand-text dark:text-white mt-3 font-brand-serif">
            Loved by Tea Lovers
          </h2>
          <p className="mt-6 text-sm sm:text-base text-gray-500 dark:text-gray-300 leading-relaxed">
            Thousands of customers trust GENZCHIYA for their daily tea experience.
            Here is what they have to say.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * index }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-brand-dark-border hover:shadow-lg hover:border-brand-primary/20 dark:hover:border-brand-primary/40 transition-all duration-300"
            >
              <Quote size={24} className="text-brand-primary/20 dark:text-brand-primary/40 mb-3" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < testimonial.rating ? 'text-brand-accent fill-brand-accent' : 'text-gray-200 dark:text-gray-700'}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-brand-dark-border"
                  loading="lazy"
                />
                <div>
                  <p className="text-xs font-bold text-brand-text dark:text-white">{testimonial.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;