// Identique à frontend/tailwind.config.ts pour cohérence visuelle
export const colors = {
  midnight: {
    50: '#E6E8F2',
    100: '#C2C7DC',
    200: '#8E96BD',
    300: '#5A659E',
    400: '#2D3B7F',
    500: '#1A2660',
    600: '#0F1A47',
    700: '#0A1233',
    800: '#070B22',
    900: '#0A0E27',
    950: '#05071A',
  },
  gold: {
    50: '#FBF6E7',
    100: '#F5E8B8',
    200: '#EDD988',
    300: '#E5C958',
    400: '#D4AF37',
    500: '#B8941F',
    600: '#8F7418',
    700: '#665411',
  },
  sapphire: {
    400: '#3B82F6',
    500: '#6366F1',
    600: '#8B5CF6',
  },
  emerald: {
    400: '#10B981',
    500: '#06B6D4',
  },
  status: {
    available: '#10B981',
    occupied: '#8B5CF6',
    cleaning: '#F59E0B',
    maintenance: '#EF4444',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Helpers gradients (React Native ne supporte pas nativement les gradients Tailwind-like)
export const gradients = {
  sapphire: ['#3B82F6', '#8B5CF6'] as [string, string],
  emerald: ['#10B981', '#06B6D4'] as [string, string],
  gold: ['#D4AF37', '#F5E8B8'] as [string, string],
  dark: ['#0A0E27', '#05071A'] as [string, string],
};
