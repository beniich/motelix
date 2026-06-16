import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, Star, Check, ChevronRight, Loader2, AlertCircle, RefreshCw, Crown } from 'lucide-react';
import { useGuests, useGuest, useToggleVip, type Guest } from '@/hooks/useGuests';
import { useReservations } from '@/hooks/useReservations';

// ─── Radar chart (SVG, no deps) ───────────────────────────────────────────────

function RadarChart({ values }: { values: number[] }) {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 45;
  const labels = ['Gastronomie', 'Spa', 'Confidentialité', 'Sport', 'Art'];
  const n = values.length;

  const points = values.map((v, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const d = (v / 100) * r;
    return { x: cx + d * Math.cos(angle), y: cy + d * Math.sin(angle) };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  const axisPoints = labels.map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map(scale => (
        <polygon
          key={scale}
          points={axisPoints.map(p => `${cx + (p.x - cx) * scale},${cy + (p.y - cy) * scale}`).join(' ')}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="0.8"
        />
      ))}
      {axisPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
      ))}
      <polygon points={polyline} fill="rgba(113,63,12,0.25)" stroke="#b45309" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function GuestSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-56 rounded-2xl bg-gray-200" />
      <div className="h-32 rounded-2xl bg-gray-200" />
      <div className="h-24 rounded-2xl bg-gray-200" />
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-red-500 py-12">
      <AlertCircle className="w-8 h-8" />
      <p className="text-sm">{message}</p>
      <button onClick={onRetry} className="flex items-center gap-1 text-xs border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50">
        <RefreshCw className="w-3.5 h-3.5" /> Réessayer
      </button>
    </div>
  );
}

// ─── Loyalty tier from total stays ───────────────────────────────────────────

function loyaltyTier(stays: number) {
  if (stays >= 20) return { label: 'DIAMOND', color: '#0ea5e9', points: 950 };
  if (stays >= 10) return { label: 'PLATINUM', color: '#8b5cf6', points: 720 };
  if (stays >= 5)  return { label: 'GOLD',     color: '#b45309', points: 480 };
  return { label: 'SILVER', color: '#94a3b8', points: 200 };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function GuestsDashboard() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: guestsData, isLoading: listLoading, isError: listError, refetch: refetchList } = useGuests({ search, pageSize: 20 } as any);
  const guests: Guest[] = (guestsData as any)?.items ?? [];

  // Auto-select first
  const activeId = selectedId ?? guests[0]?.id ?? null;

  const { data: guest, isLoading: profileLoading } = useGuest(activeId ?? '');
  const { data: staysData, isLoading: staysLoading } = useReservations(
    activeId ? { guestId: activeId, status: 'CHECKED_OUT', pageSize: 5 } : {}
  );
  const toggleVip = useToggleVip();

  const stays = staysData?.items ?? [];
  const tier = useMemo(() => loyaltyTier(guest?.totalStays ?? 0), [guest]);

  const radarValues = useMemo(() => {
    // Generate pseudo-stable values from guest revenue
    if (!guest) return [70, 60, 80, 50, 65];
    const seed = guest.totalRevenue ?? 0;
    return [
      Math.min(98, 55 + (seed % 40)),
      Math.min(95, 45 + ((seed * 3) % 48)),
      Math.min(98, 70 + (seed % 25)),
      Math.min(90, 40 + ((seed * 7) % 45)),
      Math.min(92, 50 + ((seed * 11) % 40)),
    ];
  }, [guest]);

  return (
    <div
      className="w-full min-h-full p-6 flex gap-6"
      style={{
        background: 'linear-gradient(135deg,#f5f1eb 0%,#ede8e0 100%)',
        backgroundAttachment: 'fixed',
        fontFamily: "'Outfit', sans-serif",
        color: '#1a1a2e',
      }}
    >
      {/* Guest list panel */}
      <aside
        className="w-72 shrink-0 rounded-2xl flex flex-col overflow-hidden shadow-lg border"
        style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.6)' }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Guests VIP</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Rechercher..."
              className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border bg-white/80 focus:outline-none"
              style={{ borderColor: 'rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {listLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : listError ? (
            <ErrorBanner message="Erreur chargement clients" onRetry={refetchList} />
          ) : guests.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">Aucun client trouvé</p>
          ) : (
            guests.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedId(g.id)}
                className="w-full flex items-center gap-3 p-4 border-b text-left transition-colors"
                style={{
                  borderColor: 'rgba(0,0,0,0.05)',
                  backgroundColor: activeId === g.id ? 'rgba(180,83,9,0.08)' : 'transparent',
                  borderLeft: activeId === g.id ? '3px solid #b45309' : '3px solid transparent',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg,#b45309,#78350f)' }}
                >
                  {g.firstName[0]}{g.lastName[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {g.firstName} {g.lastName}
                    {g.vip && <Crown className="inline w-3 h-3 ml-1 text-yellow-500" />}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{g.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main dossier */}
      <div className="flex-1 flex gap-6 min-w-0">
        {profileLoading || !guest ? (
          <div className="flex-1"><GuestSkeleton /></div>
        ) : (
          <>
            {/* Left: Dossier card */}
            <div className="w-80 shrink-0 flex flex-col gap-4">
              {/* Profile card */}
              <div
                className="rounded-2xl p-6 text-white shadow-lg"
                style={{ background: 'linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#b45309,#78350f)', border: '2px solid rgba(255,255,255,0.2)' }}
                  >
                    {guest.firstName[0]}{guest.lastName[0]}
                  </div>
                  <button
                    onClick={() => toggleVip.mutate(guest.id)}
                    disabled={toggleVip.isPending}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors"
                    style={{
                      borderColor: guest.vip ? '#eab308' : 'rgba(255,255,255,0.3)',
                      color: guest.vip ? '#eab308' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {toggleVip.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crown className="w-3 h-3" />}
                    {guest.vip ? 'VIP' : 'Marquer VIP'}
                  </button>
                </div>
                <h3 className="text-xl font-bold">{guest.firstName} {guest.lastName}</h3>
                <p className="text-xs opacity-60 mb-4">{guest.nationality ?? 'Nationalité N/A'}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 opacity-80">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                  {guest.phone && (
                    <div className="flex items-center gap-2 opacity-80">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{guest.phone}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold">{guest.totalStays}</p>
                    <p className="text-xs opacity-50">Séjours</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">€{Math.round(guest.totalRevenue / 100).toLocaleString()}</p>
                    <p className="text-xs opacity-50">Revenus</p>
                  </div>
                </div>
              </div>

              {/* Loyalty */}
              <div className="rounded-2xl p-5 shadow-md border bg-white/70" style={{ borderColor: 'rgba(0,0,0,0.07)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Programme Fidélité</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: tier.color }}>{tier.label}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ color: i < Math.ceil((guest.totalStays / 20) * 5) ? '#b45309' : '#d1d5db' }} fill={i < Math.ceil((guest.totalStays / 20) * 5) ? '#b45309' : 'none'} />
                  ))}
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (guest.totalStays / 20) * 100)}%`, background: 'linear-gradient(to right,#b45309,#78350f)' }} />
                </div>
                <p className="text-xs text-gray-500">{tier.points} pts · {Math.max(0, 20 - guest.totalStays)} séjours pour prochain niveau</p>
              </div>
            </div>

            {/* Right: Preferences + history */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              {/* Radar + preferences */}
              <div className="rounded-2xl p-5 shadow-md border bg-white/70 flex flex-col gap-4" style={{ borderColor: 'rgba(0,0,0,0.07)', backdropFilter: 'blur(8px)' }}>
                <h4 className="text-sm font-semibold text-gray-700">Profil de Préférences</h4>
                <div className="flex items-center gap-6">
                  <RadarChart values={radarValues} />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {['Gastronomie', 'Spa & Bien-être', 'Confidentialité', 'Sport', 'Art & Culture'].map((label, i) => (
                      <div key={label} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50/80 rounded-lg px-3 py-2">
                        <span>{label}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${radarValues[i]}%`, background: 'linear-gradient(to right,#b45309,#78350f)' }} />
                          </div>
                          <span className="font-semibold text-gray-800 w-8 text-right">{radarValues[i]}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {guest.preferences && (
                  <div className="text-xs text-gray-500 bg-amber-50/60 rounded-lg px-3 py-2 border border-amber-100">
                    📝 {guest.preferences}
                  </div>
                )}
              </div>

              {/* Stay history */}
              <div className="rounded-2xl p-5 shadow-md border bg-white/70 flex-1" style={{ borderColor: 'rgba(0,0,0,0.07)', backdropFilter: 'blur(8px)' }}>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Historique des séjours</h4>
                {staysLoading ? (
                  <div className="space-y-3 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-gray-100" />)}</div>
                ) : stays.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Aucun séjour passé trouvé</p>
                ) : (
                  <div className="space-y-2">
                    {stays.map((stay) => (
                      <div
                        key={stay.id}
                        className="flex items-center justify-between rounded-xl px-4 py-3 border transition-colors hover:bg-amber-50/40"
                        style={{ borderColor: 'rgba(0,0,0,0.06)', backgroundColor: 'rgba(255,255,255,0.5)' }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#b45309,#78350f)' }}
                          >
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {stay.room ? `${stay.room.type} ${stay.room.number}` : 'Chambre N/A'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(stay.checkIn).toLocaleDateString('fr-FR')} — {new Date(stay.checkOut).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-800">€{stay.totalPrice?.toFixed(0)}</p>
                          <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Terminé</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
