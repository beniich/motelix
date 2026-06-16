import { useEffect, useState } from 'react';

export type HotelBrand = {
  primary: string;
  secondary: string;
  accent: string;
};

const DEFAULT_BRAND: HotelBrand = {
  primary: '#00D4FF',
  secondary: '#B026FF',
  accent: '#FFD700',
};

const STORAGE_KEY = 'sapphire_hotel_brand';

export function useHotelTheme() {
  const [brand, setBrand] = useState<HotelBrand>(() => {
    if (typeof window === 'undefined') return DEFAULT_BRAND;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_BRAND;
    } catch {
      return DEFAULT_BRAND;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brand));

    const root = document.documentElement;
    root.style.setProperty('--brand-primary', brand.primary);
    root.style.setProperty('--brand-secondary', brand.secondary);
    root.style.setProperty('--brand-accent', brand.accent);
    root.style.setProperty('--glow-blue', brand.primary);
    root.style.setProperty('--glow-purple', brand.secondary);
  }, [brand]);

  const updateBrand = (partial: Partial<HotelBrand>) => {
    setBrand((prev) => ({ ...prev, ...partial }));
  };

  const resetBrand = () => setBrand(DEFAULT_BRAND);

  return { brand, updateBrand, resetBrand };
}
