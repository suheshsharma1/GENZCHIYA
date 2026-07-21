import React from 'react';

interface SVGLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'dark' | 'light';
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
}

export const SVGLogo: React.FC<SVGLogoProps> = ({
  className = '',
  variant = 'full',
  size = 40,
  onClick,
}) => {
  const isIcon = variant === 'icon';

  const handleClick = (e?: React.MouseEvent) => {
    if (onClick) {
      if (e) onClick(e);
      return;
    }
    window.location.href = '/';
  };

  if (isIcon) {
    // Small circular icon — shows the cup area
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => handleClick(e)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        className={`inline-flex items-center cursor-pointer select-none shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/images/logo.png"
          alt="GenzChiya Logo"
          draggable={false}
          style={{
            width: size,
            height: size,
            objectFit: 'cover',
            objectPosition: 'center 15%',
            borderRadius: '50%',
            // multiply makes white pixels transparent on light backgrounds
            mixBlendMode: 'multiply',
          }}
        />
      </div>
    );
  }

  // Full logo — correct aspect ratio, white bg blended away
  const height = size * 2.2;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => handleClick(e)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      className={`inline-flex items-center cursor-pointer select-none shrink-0 ${className}`}
    >
      <img
        src="/images/logo.png"
        alt="GenzChiya — Smart Tea Café"
        draggable={false}
        style={{
          height: height,
          width: 'auto',
          maxWidth: height,
          objectFit: 'contain',
          // Light mode: multiply blends white bg away
          // Dark mode: screen keeps the artwork visible
          mixBlendMode: 'multiply',
        }}
        className="dark:[mix-blend-mode:screen]"
      />
    </div>
  );
};

export default SVGLogo;

