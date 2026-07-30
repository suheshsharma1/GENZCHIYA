import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Menu, ShoppingBag, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: ScanLine,
    number: '01',
    title: 'Scan or Select',
    description: 'Scan the QR code at your table or choose your table manually from the ordering screen.',
    color: 'brand-primary',
  },
  {
    icon: Menu,
    number: '02',
    title: 'Browse Menu',
    description: 'Explore our full tea menu with detailed descriptions, prices, and customization options.',
    color: 'brand-amber',
  },
  {
    icon: ShoppingBag,
    number: '03',
    title: 'Place Order',
    description: 'Add items to your cart, apply any offers, and place your order with one tap.',
    color: 'brand-primary',
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'Enjoy Fresh Tea',
    description: 'Your order is sent directly to the kitchen. Fresh tea delivered hot to your table.',
    color: 'brand-amber',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="relative bg-brand-bg py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-accent/[0.04] rounded-full blur-[100px]" />
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
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-brand-text mt-3 font-brand-serif">
            Simple. Fast. Premium.
          </h2>
          <p className="mt-6 text-sm sm:text-base text-gray-500 leading-relaxed">
            Ordering your favorite tea has never been easier. Follow these four steps
            and enjoy a seamless experience from table to cup.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 * index }}
              className="relative"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[calc(50%+24px)] right-[-50%] h-0.5 bg-gradient-to-r from-gray-200 to-transparent" />
              )}

              <div className="text-center lg:text-left">
                {/* Step number circle */}
                <div className={`w-16 h-16 rounded-2xl bg-${step.color}/10 flex items-center justify-center mx-auto lg:mx-0 mb-5`}>
                  <span className={`text-${step.color} font-black text-lg`}>{step.number}</span>
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-${step.color}/5 flex items-center justify-center mx-auto lg:mx-0 mb-4`}>
                  <step.icon size={22} className={`text-${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-base font-black text-brand-text tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;