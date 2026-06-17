'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, ChevronDown, Check, Globe } from 'lucide-react';
import { api } from '@/lib/api';
import { useHotelContext, type HotelContext } from '@/lib/hotelContext';
import { useAuth } from '@/lib/auth';
import { clsx } from 'clsx';

type Hotel = HotelContext;

export function HotelSwitcher() {
  const { user } = useAuth();
  const { currentHotel, setCurrentHotel } = useHotelContext();
  const [open, setOpen] = useState(false);

  const { data: hotelsData } = useQuery({
    queryKey: ['super', 'hotels', 'switcher'],
    queryFn: async () =>
      (await api.get<{ hotels: Hotel[] }>('/api/super/hotels')).data.hotels,
    enabled: user?.role === 'SUPER_ADMIN',
  });

  if (user?.role !== 'SUPER_ADMIN') return null;

  const hotels = hotelsData ?? [];

  return (
    <div className="relative mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm border border-gray-200"
      >
        <div
          className="p-1.5 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
        >
          {currentHotel ? (
            <Building2 className="w-3.5 h-3.5 text-white" />
          ) : (
            <Globe className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            {currentHotel ? 'Hôtel actif' : 'Vue super-admin'}
          </p>
          <p className="text-sm font-medium truncate text-gray-900">
            {currentHotel ? currentHotel.name : 'Tous les hôtels'}
          </p>
        </div>
        <ChevronDown
          className={clsx('w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400', open && 'rotate-180')}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-md"
          >
            {/* All hotels option */}
            <button
              onClick={() => { setCurrentHotel(null); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-100 transition-colors text-sm"
            >
              <Globe className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="flex-1 text-gray-900">Tous les hôtels</span>
              {!currentHotel && <Check className="w-4 h-4 text-amber-500" />}
            </button>

            <div className="border-t border-gray-100" />

            <div className="max-h-60 overflow-y-auto">
              {hotels.map((h) => (
                <button
                  key={h.id}
                  onClick={() => { setCurrentHotel(h); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-100 transition-colors text-sm"
                >
                  <Building2 className="w-4 h-4 shrink-0 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-gray-900">{h.name}</p>
                    <p className="text-xs text-gray-500">
                      {h.city}, {h.country}
                    </p>
                  </div>
                  {currentHotel?.id === h.id && (
                    <Check className="w-4 h-4 shrink-0 text-amber-500" />
                  )}
                </button>
              ))}
              {hotels.length === 0 && (
                <p className="px-3 py-3 text-xs text-center text-gray-500">
                  Aucun hôtel chargé
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
