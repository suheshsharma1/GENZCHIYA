import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactSection: React.FC = () => {
  const { addReview } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;
    setIsSubmitting(true);
    addReview({
      name: formData.name.trim(),
      comment: formData.message.trim(),
      rating: 5,
      status: 'submitted',
    });
    setSubmitSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: '', message: '' });
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Location',
      value: 'Gwarko, Lalitpur, Nepal',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+977-9821562664',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'genzchiya@gmail.com',
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: 'Sunday – Friday, 8:00 AM – 8:00 PM',
    },
  ];

  return (
    <section id="contact" className="relative bg-white dark:bg-brand-dark-bg transition-colors duration-300 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[10px] font-black text-brand-amber uppercase tracking-[0.3em]">
            Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-3 font-brand-serif">
            Contact Us
          </h2>
          <p className="mt-6 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Have a question, suggestion, or just want to say hello? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-brand-cream dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40 space-y-8"
          >
            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
              Contact & Location
            </h3>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 * index }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 dark:bg-brand-amber/15 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={18} className="text-brand-emerald dark:text-brand-amber" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="rounded-2xl overflow-hidden border border-brand-sage/10 dark:border-brand-dark-border/40 h-48 bg-slate-100 dark:bg-brand-dark-bg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0!2d85.3245!3d27.6789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190000000001%3A0x0!2sGwarko%2C%20Lalitpur!5e0!3m2!1sen!2snp!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GENZCHIYA Location"
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-brand-cream dark:bg-brand-dark-card rounded-3xl p-8 shadow-sm border border-brand-sage/5 dark:border-brand-dark-border/40"
          >
            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight mb-6">
              Send your Review
            </h3>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-brand-emerald/10 dark:bg-brand-amber/15 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-brand-emerald dark:text-brand-amber" />
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white">Review Submitted!</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Thank you for your review. It will appear in the reviews section.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 text-xs font-bold text-brand-emerald dark:text-brand-amber hover:underline cursor-pointer"
                >
                  Send another review
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-brand-dark-bg border border-brand-sage/10 dark:border-brand-dark-border text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 dark:focus:ring-brand-amber/30 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-brand-dark-bg border border-brand-sage/10 dark:border-brand-dark-border text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 dark:focus:ring-brand-amber/30 transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-emerald dark:bg-brand-amber hover:bg-brand-sage dark:hover:bg-brand-gold text-white dark:text-brand-dark-bg font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-brand-emerald/20 dark:shadow-brand-amber/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Star size={16} />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;