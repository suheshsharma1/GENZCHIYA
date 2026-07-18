import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SVGLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'dark' | 'light';
  size?: number;
  onClick?: () => void;
}

export const SVGLogo: React.FC<SVGLogoProps> = ({ 
  className = '', 
  variant = 'full', 
  size = 40,
  onClick
}) => {
  const navigate = useNavigate();
  const isIcon = variant === 'icon';
  const isDark = variant === 'dark';
  
  const darkBrown = '#3E2723';
  const teaColor = '#6D4C41';
  const oliveGreen = '#5E7043';
  const whiteContrast = '#FAF7F2';

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    window.location.href = '/';
  };

  const logoSvg = (
    <svg
      width={isIcon ? size : '100%'}
      height={isIcon ? size : 'auto'}
      viewBox="0 0 500 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      style={!isIcon ? { maxWidth: `${size * 3}px` } : undefined}
    >
      <g id="emblem">
        <path
          d="M 173 118 A 66 66 0 0 1 268 32"
          stroke={darkBrown}
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        <path
          d="M 223 158 C 172 118 190 75 204 60 C 205 65 220 105 223 158 Z"
          fill={oliveGreen}
        />
        <path
          d="M 223 158 C 218 135 210 110 204 60"
          stroke={whiteContrast}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        <path
          d="M 223 158 C 160 150 148 110 152 90 C 158 102 188 124 223 158 Z"
          fill={oliveGreen}
        />
        <path
          d="M 223 158 C 200 140 178 122 152 90"
          stroke={whiteContrast}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        <path
          d="M 227 126 Q 268 152 316 128"
          stroke={darkBrown}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 183 162 Q 248 200 322 134"
          stroke={darkBrown}
          strokeWidth="7"
          strokeLinecap="round"
        />

        <path
          d="M 230 92 C 230 132 250 146 268 146 C 286 146 306 132 306 92 Z"
          fill={darkBrown}
        />
        <path
          d="M 238 98 C 238 124 248 136 260 138"
          stroke={whiteContrast}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.15"
        />

        <ellipse cx="268" cy="92" rx="38" ry="9" fill={teaColor} />
        <ellipse cx="268" cy="92" rx="38" ry="9" stroke={darkBrown} strokeWidth="4.5" />

        <path
          d="M 306 99 C 322 99 332 107 332 114 C 332 121 322 129 306 129"
          stroke={darkBrown}
          strokeWidth="7.5"
          strokeLinecap="round"
        />

        <path
          d="M 267 80 C 263 70 271 62 268 52 C 265 42 271 35 268 25"
          stroke={darkBrown}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 277 82 C 273 72 281 64 278 54 C 275 44 281 37 278 27"
          stroke={darkBrown}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>

      {!isIcon && (
        <g id="typography">
          <text
            x="250"
            y="228"
            textAnchor="middle"
            fill={isDark ? whiteContrast : darkBrown}
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontSize="48"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            GENZCHIYA
          </text>

          <line x1="90" y1="266" x2="145" y2="266" stroke={isDark ? '#556B2F' : darkBrown} strokeWidth="1.5" />
          
          <text
            x="250"
            y="271"
            textAnchor="middle"
            fill={oliveGreen}
            fontFamily="'Poppins', sans-serif"
            fontSize="14"
            fontWeight="600"
            letterSpacing="0.25em"
          >
            TEA  •  COFFEE  •  SNACKS
          </text>

          <line x1="355" y1="266" x2="410" y2="266" stroke={isDark ? '#556B2F' : darkBrown} strokeWidth="1.5" />

          <text
            x="250"
            y="312"
            textAnchor="middle"
            fill={oliveGreen}
            fontFamily="'Sacramento', cursive"
            fontSize="30"
          >
            —  Gen Z for Every Chiya  —
          </text>
        </g>
      )}
    </svg>
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      className={`inline-flex items-center cursor-pointer select-none ${className}`}
    >
      {logoSvg}
    </div>
  );
};

export default SVGLogo;
