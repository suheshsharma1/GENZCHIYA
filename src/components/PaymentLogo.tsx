import React from 'react';

interface PaymentLogoProps {
  provider: 'khalti' | 'esewa' | 'cash';
  className?: string;
}

export const PaymentLogo: React.FC<PaymentLogoProps> = ({ provider, className = "w-8 h-8" }) => {
  if (provider === 'khalti') {
    return (
      <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#5C2D91"/>
        <path d="M12 14h16v2H12v-2z" fill="white"/>
        <path d="M12 18h12v2H12v-2z" fill="white" opacity="0.8"/>
        <circle cx="20" cy="26" r="4" fill="white"/>
        <path d="M18 26l1.5 1.5L22 24" stroke="#5C2D91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  
  if (provider === 'esewa') {
    return (
      <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#E85D04"/>
        <rect x="10" y="14" width="20" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M14 20h2v-4h-2v4z" fill="white"/>
        <path d="M18 20h2v-4h-2v4z" fill="white"/>
        <path d="M22 20h2v-4h-2v4z" fill="white"/>
        <circle cx="26" cy="26" r="2" fill="white"/>
      </svg>
    );
  }
  
  if (provider === 'cash') {
    return (
      <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#059669"/>
        <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="1.5" fill="none"/>
        <text x="20" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Rs</text>
      </svg>
    );
  }
  
  return null;
};

export default PaymentLogo;
