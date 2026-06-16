'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useHotelContext } from '@/lib/hotelContext';
import { useAuth } from '@/lib/auth';

/**
 * Injects ?hotelId= into all API requests automatically
 * when SUPER_ADMIN has a specific hotel selected.
 */
export function useApiWithHotel() {
  const { currentHotel } = useHotelContext();
  const { user } = useAuth();

  useEffect(() => {
    const interceptorId = api.interceptors.request.use((config) => {
      if (
        user?.role === 'SUPER_ADMIN' &&
        currentHotel &&
        config.url?.startsWith('/api/') &&
        !config.url.startsWith('/api/auth') &&
        !config.url.startsWith('/api/super') &&
        !config.url?.includes('hotelId=')
      ) {
        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}hotelId=${currentHotel.id}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptorId);
    };
  }, [currentHotel, user]);
}
