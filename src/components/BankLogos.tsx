import React from 'react';

interface LogoProps {
  className?: string;
}

export const BarclaysLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 12 C28 12 20 20 20 45 C20 70 38 85 50 88 C62 85 80 70 80 45 C80 20 72 12 50 12 Z" fill="#00A4E4" />
    <path d="M50 28 L38 38 C40 40 43 41 45 42 L33 55 L48 50 L50 72 L52 50 L67 55 L55 42 C57 41 60 40 62 38 L50 28 Z" fill="#FFFFFF" />
  </svg>
);

export const LloydsLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#005B2E" />
    <path d="M30 72 C30 72 34 52 34 42 C34 32 40 20 53 20 C56 20 58 23 56 26 C54 29 50 30 48 33 C56 33 66 38 68 46 C70 54 66 60 63 63 C60 66 53 63 53 63 C53 63 50 70 46 73 C42 76 30 72 30 72 Z" fill="#FFFFFF" />
    <path d="M38 72 L36 82" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    <path d="M46 72 L48 82" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    <path d="M58 62 L61 77" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
    <path d="M63 60 L70 75" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const NationwideLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#002C6C" />
    <circle cx="50" cy="52" r="26" fill="#E30613" />
    <path d="M50 32 L26 52 L34 52 L34 76 L66 76 L66 52 L74 52 Z" fill="#002C6C" />
    <path d="M44 56 H56 V76 H44 V56 Z" fill="#FFFFFF" />
  </svg>
);

export const NatWestLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, -2)">
      {/* Block 1 (Top) */}
      <g>
        <polygon points="50,15 68,24 50,33 32,24" fill="#FF1A75" />
        <polygon points="32,24 50,33 50,51 32,42" fill="#D6005C" />
        <polygon points="50,33 68,24 68,42 50,51" fill="#99003D" />
      </g>
      {/* Block 2 (Bottom Left) */}
      <g transform="translate(-18, 20)">
        <polygon points="50,15 68,24 50,33 32,24" fill="#FF1A75" />
        <polygon points="32,24 50,33 50,51 32,42" fill="#D6005C" />
        <polygon points="50,33 68,24 68,42 50,51" fill="#99003D" />
      </g>
      {/* Block 3 (Bottom Right) */}
      <g transform="translate(18, 20)">
        <polygon points="50,15 68,24 50,33 32,24" fill="#FF1A75" />
        <polygon points="32,24 50,33 50,51 32,42" fill="#D6005C" />
        <polygon points="50,33 68,24 68,42 50,51" fill="#99003D" />
      </g>
    </g>
  </svg>
);

export const HSBCLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="scale(0.9) translate(5, 5)">
      {/* Outer Hexagon Contour with HSBC Triangles */}
      <polygon points="20,32.5 50,50 20,67.5" fill="#DB0011" />
      <polygon points="80,32.5 50,50 80,67.5" fill="#DB0011" />
      <polygon points="20,32.5 50,15 80,32.5" fill="#DB0011" />
      <polygon points="20,67.5 50,85 80,67.5" fill="#DB0011" />
      <polygon points="50,15 50,50 20,32.5" fill="#FFFFFF" />
      <polygon points="50,15 50,50 80,32.5" fill="#FFFFFF" />
      <polygon points="50,85 50,50 20,67.5" fill="#FFFFFF" />
      <polygon points="50,85 50,50 80,67.5" fill="#FFFFFF" />
    </g>
  </svg>
);

export const SantanderLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#EC0000" />
    <path d="M50 24 C50 24 37 36 37 51 C37 65 47 71 50 71 C53 71 63 65 63 51 C63 36 50 24 50 24 Z" fill="#FFFFFF" />
    <path d="M50 36 C50 36 43 44 43 52 C43 60 47 64 50 64 C53 64 57 60 57 52 C57 44 53 36 50 36 Z" fill="#EC0000" />
    <path d="M34 66 C42 63.5 58 63.5 66 66" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

export const getBankLogo = (id: string, className?: string) => {
  switch (id) {
    case 'barclays':
      return <BarclaysLogo className={className} />;
    case 'lloyds':
      return <LloydsLogo className={className} />;
    case 'nationwide':
      return <NationwideLogo className={className} />;
    case 'natwest':
      return <NatWestLogo className={className} />;
    case 'hsbc':
      return <HSBCLogo className={className} />;
    case 'santander':
      return <SantanderLogo className={className} />;
    default:
      return null;
  }
};
