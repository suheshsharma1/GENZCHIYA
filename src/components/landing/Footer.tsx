import React from 'react';
import { SVGLogo } from '../SVGLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-brand-text dark:bg-black text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SVGLogo variant="icon" size={36} />
              <span className="text-lg font-black tracking-wider text-white">
                GENZCHIYA
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Smart Tea Café Ordering System — Designed and Developed for the modern tea experience.
            </p>
          </div>

          {/* Center: Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/about#contact' },
                { label: 'Staff Portal', href: '/login' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Social Media */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 mb-5">
              Follow Us
            </h4>
            <ul className="space-y-3">
              {['Facebook', 'Instagram', 'TikTok'].map((platform) => (
                <li key={platform}>
                  <a
                    href={`https://${platform.toLowerCase()}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            © {new Date().getFullYear()} GENZCHIYA. All Rights Reserved.
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
            Designed and Developed as a Smart Tea Café Ordering System.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;