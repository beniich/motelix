'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HotelContext = {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
};

type HotelStore = {
  currentHotel: HotelContext | null;
  setCurrentHotel: (hotel: HotelContext | null) => void;
};

export const useHotelContext = create<HotelStore>()(
  persist(
    (set) => ({
      currentHotel: null,
      setCurrentHotel: (hotel) => set({ currentHotel: hotel }),
    }),
    { name: 'sapphire-hotel-context' }
  )
);
