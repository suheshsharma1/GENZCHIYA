import React from 'react';
import { motion } from 'framer-motion';

export interface RealisticTeaCupProps {
  size?: number;
  variant?: 'full' | 'watermark' | 'glowing';
  animated?: boolean;
  className?: string;
  opacity?: number;
  cupColor?: 'matka' | 'porcelain' | 'glass';
}

export const RealisticTeaCup: React.FC<RealisticTeaCupProps> = ({
  size = 180,
  variant = 'full',
  animated = true,
  className = '',
  opacity = 1,
  cupColor = 'matka',
}) => {
  const isWatermark = variant === 'watermark';
  const isGlowing = variant === 'glowing';

  // Gradient ID prefix to ensure unique SVG defs when multiple instances render
  const idPrefix = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.1, opacity }}
    >
      {/* Glow Effect for Glowing Variant */}
      {isGlowing && (
        <div className="absolute inset-0 bg-gradient-to-t from-amber-600/30 via-orange-500/20 to-transparent rounded-full blur-2xl -z-10 animate-pulse" />
      )}

      <svg
        viewBox="0 0 200 220"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ambient Ground Shadow */}
          <radialGradient id={`${idPrefix}-groundShadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity={isWatermark ? "0.15" : "0.45"} />
            <stop offset="60%" stopColor="#000000" stopOpacity={isWatermark ? "0.05" : "0.15"} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Matka Clay Body 3D Gradient */}
          <linearGradient id={`${idPrefix}-matkaBody`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="18%" stopColor="#D97706" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Porcelain Body 3D Gradient */}
          <linearGradient id={`${idPrefix}-porcelainBody`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="25%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Glass Body 3D Gradient */}
          <linearGradient id={`${idPrefix}-glassBody`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>

          {/* Watermark Soft Monochromatic Gradient */}
          <linearGradient id={`${idPrefix}-watermarkBody`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
          </linearGradient>

          {/* Liquid (Chiya / Masala Tea) Gradient */}
          <radialGradient id={`${idPrefix}-liquidSurface`} cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="35%" stopColor="#D97706" />
            <stop offset="70%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </radialGradient>

          {/* Specular Lighting Curve */}
          <linearGradient id={`${idPrefix}-specular`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>

          {/* Steam Vapor Soft Gradient */}
          <linearGradient id={`${idPrefix}-steamGrad`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFF7ED" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Saucer Gradient */}
          <linearGradient id={`${idPrefix}-saucerGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="30%" stopColor="#D97706" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* 1. GROUND / SAUCER SHADOW */}
        <ellipse
          cx="100"
          cy="198"
          rx="72"
          ry="14"
          fill={`url(#${idPrefix}-groundShadow)`}
        />

        {/* 2. SAUCER (PLATE) */}
        {!isWatermark && (
          <g id="saucer">
            {/* Saucer Outer Rim */}
            <ellipse
              cx="100"
              cy="186"
              rx="76"
              ry="16"
              fill={`url(#${idPrefix}-${cupColor === 'porcelain' ? 'porcelainBody' : 'saucerGrad'})`}
              stroke="#78350F"
              strokeWidth="0.8"
              opacity="0.95"
            />
            {/* Saucer Inner Dish Surface */}
            <ellipse
              cx="100"
              cy="185"
              rx="64"
              ry="12"
              fill={cupColor === 'porcelain' ? '#F1F5F9' : '#B45309'}
              opacity="0.7"
            />
            {/* Inner Ring Highlight */}
            <ellipse
              cx="100"
              cy="184"
              rx="46"
              ry="8"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.8"
              opacity="0.4"
            />
          </g>
        )}

        {/* 3. CUP HANDLE (Right Side 3D Curve) */}
        <g id="cup-handle">
          {/* Handle Shadow */}
          <path
            d="M 142,95 C 178,95 182,150 138,155"
            fill="none"
            stroke="#451A03"
            strokeWidth="14"
            strokeLinecap="round"
            opacity={isWatermark ? "0.3" : "0.4"}
          />
          {/* Handle Outer Body */}
          <path
            d="M 142,95 C 178,95 182,150 138,155"
            fill="none"
            stroke={
              isWatermark
                ? "currentColor"
                : cupColor === 'porcelain'
                ? '#E2E8F0'
                : '#D97706'
            }
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Handle Inner Specular Highlight */}
          {!isWatermark && (
            <path
              d="M 143,96 C 175,96 179,148 139,153"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.65"
            />
          )}
        </g>

        {/* 4. CUP MAIN BODY */}
        <g id="cup-body">
          {/* Main 3D Tapered Silhouette */}
          <path
            d="M 46,90 C 42,135 56,182 100,182 C 144,182 158,135 154,90 Z"
            fill={
              isWatermark
                ? `url(#${idPrefix}-watermarkBody)`
                : `url(#${idPrefix}-${cupColor === 'porcelain' ? 'porcelainBody' : cupColor === 'glass' ? 'glassBody' : 'matkaBody'})`
            }
            stroke={isWatermark ? "currentColor" : cupColor === 'porcelain' ? '#CBD5E1' : '#78350F'}
            strokeWidth={isWatermark ? "2.5" : "1"}
          />

          {!isWatermark && (
            <>
              {/* Matka Organic Clay Rings / Ribs */}
              <path
                d="M 50,118 Q 100,128 150,118"
                fill="none"
                stroke="#78350F"
                strokeWidth="1.2"
                opacity="0.25"
              />
              <path
                d="M 54,142 Q 100,152 146,142"
                fill="none"
                stroke="#78350F"
                strokeWidth="1.2"
                opacity="0.2"
              />

              {/* Curved 3D Specular Highlight Line */}
              <path
                d="M 56,92 C 53,130 65,170 82,178 C 70,165 60,130 62,92 Z"
                fill={`url(#${idPrefix}-specular)`}
                opacity="0.7"
              />

              {/* Deep Right Side Occlusion Shading */}
              <path
                d="M 136,92 C 146,130 140,168 100,182 C 135,178 152,140 152,92 Z"
                fill="#451A03"
                opacity="0.25"
              />
            </>
          )}
        </g>

        {/* 5. CUP RIM & INNER OPENING */}
        <g id="cup-rim">
          {/* Rim Outer Lip Ellipse */}
          <ellipse
            cx="100"
            cy="90"
            rx="54"
            ry="16"
            fill={
              isWatermark
                ? `url(#${idPrefix}-watermarkBody)`
                : cupColor === 'porcelain'
                ? '#FFFFFF'
                : '#F59E0B'
            }
            stroke={isWatermark ? "currentColor" : '#78350F'}
            strokeWidth={isWatermark ? "2.5" : "1.2"}
          />

          {/* Inner Cup Wall (Depth Shadow) */}
          <ellipse
            cx="100"
            cy="91"
            rx="48"
            ry="13.5"
            fill={isWatermark ? "none" : "#451A03"}
            opacity={isWatermark ? 0 : 0.85}
          />

          {/* 6. HOT BREWED TEA / CHIYA LIQUID SURFACE */}
          {!isWatermark && (
            <g id="tea-liquid">
              {/* Liquid Surface Level */}
              <ellipse
                cx="100"
                cy="93"
                rx="45"
                ry="12"
                fill={`url(#${idPrefix}-liquidSurface)`}
              />

              {/* Chai Froth / Milk Foam Ring edge */}
              <ellipse
                cx="100"
                cy="93"
                rx="43"
                ry="11"
                fill="none"
                stroke="#FEF3C7"
                strokeWidth="1.5"
                strokeDasharray="4 2 8 3"
                opacity="0.65"
              />

              {/* Liquid Specular Reflection Arc */}
              <path
                d="M 70,91 A 30 7 0 0 1 125,91"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="1.2"
                opacity="0.8"
              />

              {/* Central Liquid Shimmer Accent */}
              <ellipse
                cx="96"
                cy="92"
                rx="14"
                ry="4"
                fill="#FEF08A"
                opacity="0.35"
              />
            </g>
          )}

          {/* Rim Front Highlight Sheen */}
          {!isWatermark && (
            <path
              d="M 50,92 A 52 14 0 0 0 150,92"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="1.5"
              opacity="0.5"
            />
          )}
        </g>

        {/* 7. DYNAMIC ANIMATED STEAM RISING WAVES */}
        {animated && (
          <g id="steam-waves" className="pointer-events-none">
            {/* Steam Wave 1 (Left Curve) */}
            <motion.path
              d="M 82,85 C 72,60 92,40 80,18 C 72,5 84,-5 82,-15"
              fill="none"
              stroke={isWatermark ? "currentColor" : `url(#${idPrefix}-steamGrad)`}
              strokeWidth={isWatermark ? "2.5" : "6"}
              strokeLinecap="round"
              initial={{ y: 5, opacity: 0.2 }}
              animate={
                isWatermark
                  ? { y: [-5, -15, -5], opacity: [0.2, 0.5, 0.2] }
                  : {
                      d: [
                        "M 82,85 C 72,60 92,40 80,18 C 72,5 84,-5 82,-15",
                        "M 82,85 C 90,62 74,38 88,20 C 76,8 80,-2 82,-15",
                        "M 82,85 C 72,60 92,40 80,18 C 72,5 84,-5 82,-15",
                      ],
                      opacity: [0.2, 0.7, 0.2],
                    }
              }
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Steam Wave 2 (Center Main Vapor) */}
            <motion.path
              d="M 100,83 C 114,58 90,36 104,14 C 112,2 96,-10 100,-22"
              fill="none"
              stroke={isWatermark ? "currentColor" : `url(#${idPrefix}-steamGrad)`}
              strokeWidth={isWatermark ? "3" : "7.5"}
              strokeLinecap="round"
              initial={{ y: 0, opacity: 0.3 }}
              animate={
                isWatermark
                  ? { y: [-8, -20, -8], opacity: [0.3, 0.7, 0.3] }
                  : {
                      d: [
                        "M 100,83 C 114,58 90,36 104,14 C 112,2 96,-10 100,-22",
                        "M 100,83 C 88,56 112,34 94,12 C 106,0 102,-8 100,-22",
                        "M 100,83 C 114,58 90,36 104,14 C 112,2 96,-10 100,-22",
                      ],
                      opacity: [0.3, 0.85, 0.3],
                    }
              }
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />

            {/* Steam Wave 3 (Right Gentle Ribbon) */}
            <motion.path
              d="M 118,86 C 126,64 108,44 122,22 C 114,10 120,0 118,-12"
              fill="none"
              stroke={isWatermark ? "currentColor" : `url(#${idPrefix}-steamGrad)`}
              strokeWidth={isWatermark ? "2.5" : "5.5"}
              strokeLinecap="round"
              initial={{ y: 5, opacity: 0.2 }}
              animate={
                isWatermark
                  ? { y: [-4, -12, -4], opacity: [0.2, 0.6, 0.2] }
                  : {
                      d: [
                        "M 118,86 C 126,64 108,44 122,22 C 114,10 120,0 118,-12",
                        "M 118,86 C 110,66 128,42 114,20 C 124,8 116,-2 118,-12",
                        "M 118,86 C 126,64 108,44 122,22 C 114,10 120,0 118,-12",
                      ],
                      opacity: [0.15, 0.65, 0.15],
                    }
              }
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Floating Rising Aroma Particles */}
            {!isWatermark && (
              <>
                <motion.circle
                  cx="90"
                  cy="75"
                  r="2.5"
                  fill="#FFF7ED"
                  animate={{
                    y: [-10, -55],
                    x: [0, 8, -4],
                    opacity: [0.8, 0],
                    scale: [0.8, 1.8],
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.circle
                  cx="108"
                  cy="78"
                  r="2"
                  fill="#FEF3C7"
                  animate={{
                    y: [-10, -60],
                    x: [0, -10, 5],
                    opacity: [0.7, 0],
                    scale: [0.6, 2],
                  }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
                />
                <motion.circle
                  cx="98"
                  cy="70"
                  r="1.8"
                  fill="#FFFFFF"
                  animate={{
                    y: [-10, -48],
                    x: [0, 6, -6],
                    opacity: [0.9, 0],
                    scale: [1, 2.2],
                  }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                />
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

export default RealisticTeaCup;
