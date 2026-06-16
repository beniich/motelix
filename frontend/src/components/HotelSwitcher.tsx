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
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
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
          <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8E96BD' }}>
            {currentHotel ? 'Hôtel actif' : 'Vue super-admin'}
          </p>
          <p className="text-sm font-medium truncate" style={{ color: '#E6E8F2' }}>
            {currentHotel ? currentHotel.name : 'Tous les hôtels'}
          </p>
        </div>
        <ChevronDown
          className={clsx('w-4 h-4 shrink-0 transition-transform duration-200', open && 'rotate-180')}
          style={{ color: '#8E96BD' }}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(10,14,39,0.98)',
              border: '1px solid rgba(212,175,55,0.3)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* All hotels option */}
            <button
              onClick={() => { setCurrentHotel(null); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/5 transition-colors text-sm"
            >
              <Globe className="w-4 h-4 shrink-0" style={{ color: '#D4AF37' }} />
              <span className="flex-1" style={{ color: '#E6E8F2' }}>Tous les hôtels</span>
              {!currentHotel && <Check className="w-4 h-4" style={{ color: '#D4AF37' }} />}
            </button>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

            <div className="max-h-60 overflow-y-auto">
              {hotels.map((h) => (
                <button
                  key={h.id}
                  onClick={() => { setCurrentHotel(h); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/5 transition-colors text-sm"
                >
                  <Building2 className="w-4 h-4 shrink-0" style={{ color: '#8E96BD' }} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ color: '#E6E8F2' }}>{h.name}</p>
                    <p className="text-xs" style={{ color: '#8E96BD' }}>
                      {h.city}, {h.country}
                    </p>
                  </div>
                  {currentHotel?.id === h.id && (
                    <Check className="w-4 h-4 shrink-0" style={{ color: '#D4AF37' }} />
                  )}
                </button>
              ))}
              {hotels.length === 0 && (
                <p className="px-3 py-3 text-xs text-center" style={{ color: '#8E96BD' }}>
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
