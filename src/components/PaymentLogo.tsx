import React from 'react';

interface PaymentLogoProps {
  provider: 'khalti' | 'cash';
  className?: string;
}

export const PaymentLogo: React.FC<PaymentLogoProps> = ({ provider, className = "w-8 h-8" }) => {
  if (provider === 'khalti') {
    // Accurate Khalti "khalti by IME" red logo recreation
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Paper plane arrow icon — top right of "khalti" */}
        <g transform="translate(82, 4) rotate(20)">
          {/* Main triangle body */}
          <polygon points="0,18 18,0 18,18" fill="#E8192C" />
          {/* Tail cut */}
          <polygon points="0,18 9,9 0,9" fill="#B01020" />
          {/* Left wing triangle */}
          <polygon points="0,18 18,18 9,9" fill="#C8141E" />
        </g>

        {/* "khalti" lowercase red bold text */}
        <text
          x="4"
          y="52"
          fill="#E8192C"
          fontSize="34"
          fontWeight="900"
          fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
          letterSpacing="-0.5"
        >
          khalti
        </text>

        {/* "by" in dark gray */}
        <text
          x="18"
          y="70"
          fill="#333333"
          fontSize="13"
          fontWeight="400"
          fontFamily="Arial, sans-serif"
          letterSpacing="0.2"
        >
          by
        </text>

        {/* "IME" in bold red */}
        <text
          x="40"
          y="70"
          fill="#E8192C"
          fontSize="14"
          fontWeight="900"
          fontFamily="'Arial Black', Arial, sans-serif"
          letterSpacing="0.5"
        >
          IME
        </text>
      </svg>
    );
  }

  if (provider === 'cash') {
    // Hand holding banknotes illustration
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Back banknote (slightly rotated) */}
        <g transform="translate(14, 14) rotate(-12, 38, 30)">
          <rect x="4" y="10" width="54" height="32" rx="3" fill="#4CAF72" />
          <rect x="4" y="10" width="54" height="32" rx="3" stroke="#2E7D45" strokeWidth="1" />
          {/* Note detail lines */}
          <rect x="8" y="14" width="12" height="8" rx="1.5" fill="#2E7D45" opacity="0.4" />
          <rect x="36" y="14" width="18" height="8" rx="1.5" fill="#2E7D45" opacity="0.4" />
          <circle cx="31" cy="26" r="7" stroke="#2E7D45" strokeWidth="1.5" fill="none" opacity="0.5" />
          <text x="28" y="30" fill="#2E7D45" fontSize="8" fontWeight="bold" opacity="0.6">₨</text>
        </g>

        {/* Front banknote */}
        <g transform="translate(8, 10) rotate(-4, 38, 30)">
          <rect x="4" y="14" width="56" height="33" rx="3" fill="#5DBF7A" />
          <rect x="4" y="14" width="56" height="33" rx="3" stroke="#3A8C52" strokeWidth="1" />
          {/* Detail areas */}
          <rect x="8" y="18" width="13" height="9" rx="1.5" fill="#3A8C52" opacity="0.4" />
          <rect x="39" y="18" width="17" height="9" rx="1.5" fill="#3A8C52" opacity="0.4" />
          {/* Center coin circle */}
          <circle cx="32" cy="30" r="8" stroke="#3A8C52" strokeWidth="1.5" fill="#4CAF72" opacity="0.8" />
          <text x="29" y="34" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif">₨</text>
          {/* Horizontal lines */}
          <line x1="8" y1="39" x2="25" y2="39" stroke="#3A8C52" strokeWidth="1" opacity="0.5" />
          <line x1="41" y1="39" x2="57" y2="39" stroke="#3A8C52" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Hand holding */}
        <g transform="translate(12, 40)">
          {/* Palm / wrist */}
          <rect x="10" y="14" width="28" height="16" rx="6" fill="#F0C060" />
          {/* Sleeve / cuff */}
          <rect x="12" y="26" width="24" height="8" rx="3" fill="#4CAF72" />
          {/* Thumb */}
          <ellipse cx="10" cy="20" rx="6" ry="5" fill="#F0C060" />
          <ellipse cx="10" cy="20" rx="4" ry="3.5" fill="#E8B040" />
          {/* Finger knuckle whites */}
          <circle cx="22" cy="15" r="3" fill="#FAECD0" opacity="0.6" />
          <circle cx="30" cy="14" r="2.5" fill="#FAECD0" opacity="0.6" />
        </g>
      </svg>
    );
  }

  return null;
};

export default PaymentLogo;
