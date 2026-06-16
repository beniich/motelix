/**
 * SAPPHIRE Design System
 * Global tokens for dark mode premium with electric glow
 */

export const colors = {
  // Backgrounds (fond principal, plus sombres)
  bg: {
    primary: '#05060A',      // Fond principal (presque noir, deep blue tint)
    secondary: '#0A0E1A',    // Fond secondaire (cards principales)
    tertiary: '#0F1424',     // Fond tertiaire (cards nested)
    elevated: '#151B2E',     // Cards élevées (modals, popovers)
    overlay: 'rgba(5, 6, 10, 0.85)', // Overlays
  },

  // Off-white cassé clair (pour fonds de cartes contrastés)
  offwhite: {
    50: '#F8F7F2',   // Très clair, cassé (yellow tint)
    100: '#F2F0E8',  // Clair cassé
    200: '#E8E5D8',  // Cassé moyen
    300: '#D9D5C2',  // Cassé foncé
    400: '#A8A290',  // Texte muted sur fond clair
  },

  // Text
  text: {
    primary: '#F8F7F2',     // Off-white cassé (sur fonds sombres)
    secondary: '#D9D5C2',   // Cassé medium
    muted: '#7A7565',       // Texte muted
    inverse: '#0A0E1A',     // Texte sur fond clair
  },

  // Borders (toujours en noir)
  border: {
    primary: '#000000',
    secondary: 'rgba(0, 0, 0, 0.6)',
    subtle: 'rgba(0, 0, 0, 0.3)',
  },

  // Electric glow palette (ombres néon)
  glow: {
    blue: '#00D4FF',      // Cyan électrique
    blueDark: '#0099CC',
    purple: '#B026FF',    // Violet électrique
    purpleDark: '#7A00CC',
    cyan: '#00FFFF',      // Cyan pur
    pink: '#FF00E5',      // Rose électrique
    green: '#00FF88',     // Vert électrique
    gold: '#FFD700',      // Or (pour accents luxury)
  },

  // Status colors (avec glow correspondant)
  status: {
    success: '#00FF88',
    warning: '#FFB800',
    danger: '#FF3355',
    info: '#00D4FF',
  },

  // Accent (couleur principale de marque)
  accent: {
    primary: '#D4AF37',   // Gold luxury
    secondary: '#B8941F',
  },
} as const;

export const shadows = {
  // Glow shadows (ore électrique)
  glowBlue: '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)',
  glowBlueStrong: '0 0 30px rgba(0, 212, 255, 0.6), 0 0 60px rgba(0, 212, 255, 0.3)',
  glowBlueSubtle: '0 0 15px rgba(0, 212, 255, 0.25), 0 0 30px rgba(0, 212, 255, 0.1)',
  
  glowPurple: '0 0 20px rgba(176, 38, 255, 0.4), 0 0 40px rgba(176, 38, 255, 0.2)',
  glowPurpleStrong: '0 0 30px rgba(176, 38, 255, 0.6), 0 0 60px rgba(176, 38, 255, 0.3)',
  glowPurpleSubtle: '0 0 15px rgba(176, 38, 255, 0.25), 0 0 30px rgba(176, 38, 255, 0.1)',
  
  glowCyan: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.25)',
  glowPink: '0 0 20px rgba(255, 0, 229, 0.5), 0 0 40px rgba(255, 0, 229, 0.25)',
  glowGreen: '0 0 20px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.2)',
  glowGold: '0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.25)',

  // Standard shadows (avec bordure noire)
  card: '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.8)',
  cardHover: '0 4px 16px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 0, 0, 0.9)',
  cardStrong: '0 8px 32px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(0, 0, 0, 1)',
  
  // Inset (pour inputs, search bars)
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
} as const;

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;
