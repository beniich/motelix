import React, { useState, useMemo } from 'react';
import { Search, Crown, PenLine, MousePointer2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';
import type { Reservation } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarEntry extends Reservation {
  guest: { firstName: string; lastName: string; vip: boolean };
  room: { number: string; floor: number; type: string };
}

interface ReservationStats {
  totalActive: number;
  checkInsToday: number;
  checkOutsToday: number;
  pendingConfirmation: number;
  totalRevenue: number;
  occupancyRate: number;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

// Calendar window: from today, 46 days total (current month + 15 days next)
function useCalendar() {
  const from = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString();
  }, []);
  const to = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString();
  }, []);

  return useQuery<CalendarEntry[]>({
    queryKey: ['reservations', 'calendar', from, to],
    queryFn: () => api.get<CalendarEntry[]>('/reservations/calendar', { from, to }),
    refetchInterval: 30_000,
  });
}

function useReservationStats() {
  return useQuery<ReservationStats>({
    queryKey: ['reservations', 'stats'],
    queryFn: () => api.get<ReservationStats>('/reservations/stats'),
    refetchInterval: 60_000,
  });
}

function useConfirmReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/reservations/${id}/confirm`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/reservations/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

// ─── Gantt helpers ────────────────────────────────────────────────────────────

const DAY_PX = 30;
const ROW_H = 40;

function getGanttOrigin(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function barLeft(checkIn: string, origin: Date) {
  const days = Math.max(0, daysBetween(origin, new Date(checkIn)));
  return days * DAY_PX;
}

function barWidth(checkIn: string, checkOut: string) {
  const nights = Math.max(1, daysBetween(new Date(checkIn), new Date(checkOut)));
  return nights * DAY_PX;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GanttSkeleton() {
  return (
    <div className="flex-1 flex flex-col animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-[40px] flex items-center px-3 border-b border-white/10">
          <div className="h-3 bg-white/20 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-red-300 p-8">
      <AlertCircle className="w-10 h-10" />
      <p className="text-sm font-mono">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/40 hover:bg-red-500/20 transition-colors text-sm"
      >
        <RefreshCw className="w-4 h-4" /> Réessayer
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function ReservationsDashboard() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: calendar, isLoading: calLoading, isError: calError, refetch: refetchCal } = useCalendar();
  const { data: stats, isLoading: statsLoading } = useReservationStats();
  const confirmRes = useConfirmReservation();
  const cancelRes = useCancelReservation();

  const origin = useMemo(() => getGanttOrigin(), []);

  // Build unique room rows from calendar entries
  const rows = useMemo(() => {
    if (!calendar) return [];
    const map = new Map<string, { roomLabel: string; entries: CalendarEntry[] }>();
    calendar.forEach((r) => {
      const key = r.room?.number ? `${r.room.number}-${r.room.type}` : r.id;
      const label = r.room ? `Zafir — ${r.room.type} ${r.room.number}` : 'N/A';
      if (!map.has(key)) map.set(key, { roomLabel: label, entries: [] });
      map.get(key)!.entries.push(r);
    });
    return Array.from(map.values());
  }, [calendar]);

  // Filter
  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.roomLabel.toLowerCase().includes(q) ||
        r.entries.some((e) => `${e.guest?.firstName} ${e.guest?.lastName}`.toLowerCase().includes(q))
    );
  }, [rows, search]);

  const selectedEntry = useMemo(
    () => (selectedId ? calendar?.find((r) => r.id === selectedId) ?? null : null),
    [selectedId, calendar]
  );

  // Day header columns (46 days)
  const dayHeaders = useMemo(() => {
    const days = [];
    for (let i = 0; i < 46; i++) {
      const d = new Date(origin);
      d.setDate(origin.getDate() + i);
      days.push({ label: d.getDate(), month: d.getMonth(), full: d });
    }
    return days;
  }, [origin]);

  const monthGroups = useMemo(() => {
    const groups: { label: string; start: number; count: number }[] = [];
    dayHeaders.forEach((d, i) => {
      const label = d.full.toLocaleString('fr-FR', { month: 'short', year: '2-digit' }).toUpperCase();
      if (!groups.length || groups[groups.length - 1].label !== label) {
        groups.push({ label, start: i, count: 1 });
      } else {
        groups[groups.length - 1].count++;
      }
    });
    return groups;
  }, [dayHeaders]);

  // Colour by status
  function blockColor(status: string, vip: boolean) {
    if (vip) return { bg: 'linear-gradient(135deg, #e6c875 0%, #b8923a 100%)', border: 'rgba(234,179,8,0.5)', text: '#000' };
    if (status === 'CONFIRMED' || status === 'CHECKED_IN') return { bg: '#2c5282', border: 'rgba(96,165,250,0.3)', text: '#fff' };
    if (status === 'CHECKED_OUT') return { bg: '#2f855a', border: 'rgba(34,197,94,0.3)', text: '#fff' };
    return { bg: '#5c636a', border: 'rgba(255,255,255,0.2)', text: '#fff' };
  }

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <div
      className="w-full h-full min-h-screen flex flex-col p-4 gap-4 selection:bg-[#b8923a] selection:text-white"
      style={{ backgroundColor: '#3c4048', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .gantt-scroll::-webkit-scrollbar { height: 10px; width: 10px; }
        .gantt-scroll::-webkit-scrollbar-track { background: #32363e; border-radius: 5px; }
        .gantt-scroll::-webkit-scrollbar-thumb { background: #5c636a; border-radius: 5px; }
        .gantt-scroll::-webkit-scrollbar-thumb:hover { background: #717a85; }
        .gantt-grid-bg {
          background-image: linear-gradient(to right,rgba(92,99,106,0.3) 1px,transparent 1px),
                            linear-gradient(to bottom,rgba(92,99,106,0.3) 1px,transparent 1px);
          background-size: ${DAY_PX}px ${ROW_H}px;
        }
        .gold-gradient { background: linear-gradient(135deg,#e6c875 0%,#b8923a 100%); }
      `}</style>

      {/* Main content */}
      <main className="flex-1 flex gap-4 overflow-hidden">

        {/* Gantt section */}
        <section
          className="flex-1 rounded-lg shadow-lg border flex flex-col overflow-hidden"
          style={{ backgroundColor: '#4d535b', borderColor: '#5c636a' }}
        >
          {/* Header */}
          <header
            className="flex items-center justify-between p-4 border-b shrink-0"
            style={{ borderColor: '#5c636a', backgroundColor: '#32363e' }}
          >
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Global Occupancy Calendar
            </h2>
            <div className="flex items-center gap-3">
              {calLoading && <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Chercher chambre ou client..."
                  className="border text-sm rounded-md pl-9 pr-3 py-1.5 focus:outline-none w-64 transition-colors"
                  style={{ backgroundColor: '#3c4048', borderColor: '#5c636a', color: '#e2e8f0' }}
                />
              </div>
            </div>
          </header>

          {/* Timeline header */}
          <div className="flex border-b shrink-0" style={{ backgroundColor: '#32363e', borderColor: '#5c636a' }}>
            {/* Room column header */}
            <div className="w-64 shrink-0 border-r p-3 flex flex-col justify-end" style={{ borderColor: '#5c636a' }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Chambre</span>
            </div>
            {/* Days */}
            <div className="flex-1 overflow-hidden">
              {/* Month labels */}
              <div className="flex relative h-5">
                {monthGroups.map((g) => (
                  <div
                    key={g.label + g.start}
                    className="shrink-0 text-[9px] font-bold tracking-widest flex items-center px-1"
                    style={{ width: `${g.count * DAY_PX}px`, color: '#94a3b8' }}
                  >
                    {g.label}
                  </div>
                ))}
              </div>
              {/* Day numbers */}
              <div className="flex pb-1">
                {dayHeaders.map((d, i) => (
                  <div
                    key={i}
                    className="w-[30px] shrink-0 text-center text-[10px]"
                    style={{
                      color: '#94a3b8',
                      fontWeight: d.full.getDay() === 0 || d.full.getDay() === 6 ? 'bold' : 'normal',
                    }}
                  >
                    {d.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gantt body */}
          {calError ? (
            <ErrorBanner message="Impossible de charger le calendrier" onRetry={refetchCal} />
          ) : calLoading ? (
            <GanttSkeleton />
          ) : (
            <div className="flex-1 overflow-auto gantt-scroll flex relative" style={{ backgroundColor: 'rgba(50,54,62,0.5)' }}>
              {/* Room labels */}
              <div
                className="w-64 shrink-0 border-r z-10 sticky left-0 flex flex-col"
                style={{ backgroundColor: '#4d535b', borderColor: '#5c636a' }}
              >
                {filteredRows.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-sm" style={{ color: '#94a3b8' }}>
                    Aucune réservation trouvée
                  </div>
                ) : (
                  filteredRows.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center px-3 border-b text-sm transition-colors cursor-default truncate"
                      style={{ height: `${ROW_H}px`, borderColor: 'rgba(92,99,106,0.4)', color: '#e2e8f0' }}
                    >
                      {row.roomLabel}
                    </div>
                  ))
                )}
              </div>

              {/* Chart area */}
              <div
                className="flex-1 relative gantt-grid-bg"
                style={{ minWidth: `${46 * DAY_PX}px` }}
              >
                <div className="relative w-full h-full flex flex-col">
                  {filteredRows.map((row, ri) => (
                    <div
                      key={ri}
                      className="relative border-b"
                      style={{ height: `${ROW_H}px`, borderColor: 'rgba(92,99,106,0.2)' }}
                    >
                      {row.entries.map((entry) => {
                        const colors = blockColor(entry.status, entry.guest?.vip ?? false);
                        const left = barLeft(entry.checkIn, origin);
                        const width = barWidth(entry.checkIn, entry.checkOut);
                        const isSelected = selectedId === entry.id;
                        return (
                          <div
                            key={entry.id}
                            onClick={() => setSelectedId(entry.id === selectedId ? null : entry.id)}
                            className="absolute top-[4px] h-[32px] rounded cursor-pointer transition-all flex flex-col justify-center px-2 overflow-hidden z-10"
                            style={{
                              left: `${left}px`,
                              width: `${width}px`,
                              background: colors.bg,
                              border: `1px solid ${colors.border}`,
                              boxShadow: isSelected ? '0 0 0 2px white' : undefined,
                              color: colors.text,
                            }}
                          >
                            <div className="flex items-center gap-1">
                              {entry.guest?.vip && <Crown className="w-2.5 h-2.5 shrink-0" />}
                              <span className="text-[11px] font-bold truncate leading-tight">
                                {entry.guest?.firstName} {entry.guest?.lastName}
                              </span>
                            </div>
                            <span className="text-[9px] truncate leading-tight opacity-80">
                              {entry.status} · {new Date(entry.checkIn).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Booking details sidebar */}
        <aside
          className="w-80 shrink-0 rounded-lg shadow-lg border flex flex-col"
          style={{ backgroundColor: '#4d535b', borderColor: '#5c636a' }}
        >
          <header className="p-4 border-b rounded-t-lg" style={{ backgroundColor: '#32363e', borderColor: '#5c636a' }}>
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Booking Details
            </h2>
          </header>

          {selectedEntry ? (
            <>
              <div className="p-5 flex-1 overflow-y-auto space-y-5">
                {[
                  { label: 'Reservation ID', value: selectedEntry.reference || selectedEntry.id.slice(0, 8).toUpperCase() },
                  { label: 'Guest', value: `${selectedEntry.guest?.firstName} ${selectedEntry.guest?.lastName}` },
                  { label: 'Room', value: selectedEntry.room ? `${selectedEntry.room.type} ${selectedEntry.room.number}` : '—' },
                  {
                    label: 'Dates',
                    value: `${new Date(selectedEntry.checkIn).toLocaleDateString('fr-FR')} → ${new Date(selectedEntry.checkOut).toLocaleDateString('fr-FR')}`,
                  },
                  { label: 'Total', value: `€${selectedEntry.totalPrice?.toFixed(2) ?? '—'}` },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider block" style={{ color: '#94a3b8' }}>{label}:</label>
                    <div
                      className="text-sm font-medium text-white p-2 rounded border"
                      style={{ backgroundColor: '#32363e', borderColor: 'rgba(92,99,106,0.5)' }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider block" style={{ color: '#94a3b8' }}>Status:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          selectedEntry.status === 'CONFIRMED' ? '#e6c875' :
                          selectedEntry.status === 'CHECKED_IN' ? '#4ade80' :
                          selectedEntry.status === 'CANCELLED' ? '#f87171' : '#94a3b8',
                        boxShadow: '0 0 5px currentColor',
                      }}
                    />
                    <span className="text-sm font-medium text-white">
                      {selectedEntry.status}{selectedEntry.guest?.vip ? ' (VIP)' : ''}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t space-y-3 rounded-b-lg" style={{ borderColor: '#5c636a', backgroundColor: 'rgba(50,54,62,0.5)' }}>
                {selectedEntry.status === 'PENDING' && (
                  <button
                    onClick={() => confirmRes.mutate(selectedEntry.id)}
                    disabled={confirmRes.isPending}
                    className="w-full py-2.5 px-4 text-black text-sm font-bold rounded shadow-md transition-all active:scale-[0.98] gold-gradient flex items-center justify-center gap-2"
                  >
                    {confirmRes.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Confirmer réservation
                  </button>
                )}
                {!['CANCELLED', 'CHECKED_OUT', 'CHECKED_IN'].includes(selectedEntry.status) && (
                  <button
                    onClick={() => cancelRes.mutate(selectedEntry.id)}
                    disabled={cancelRes.isPending}
                    className="w-full py-2.5 px-4 text-sm font-medium rounded transition-colors hover:text-white flex items-center justify-center gap-2"
                    style={{ color: '#94a3b8' }}
                  >
                    {cancelRes.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Annuler
                  </button>
                )}
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-full py-2.5 px-4 text-white text-sm font-medium rounded shadow transition-colors hover:brightness-110"
                  style={{ backgroundColor: '#5c636a' }}
                >
                  Fermer
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3" style={{ color: '#94a3b8' }}>
              <MousePointer2 className="w-10 h-10 opacity-40" />
              <p className="text-sm text-center">Cliquez sur une réservation dans le calendrier pour voir ses détails</p>
            </div>
          )}
        </aside>
      </main>

      {/* Bottom metrics */}
      <footer className="shrink-0">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg p-3 shadow-md flex flex-col items-center justify-center text-black gold-gradient">
            <span className="text-sm font-semibold opacity-80 uppercase tracking-wider">Taux d'occupation:</span>
            <span className="text-2xl font-bold mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {statsLoading ? '—' : `${stats?.occupancyRate ?? 0}%`}
            </span>
          </div>
          <div className="rounded-lg p-3 border shadow-sm flex flex-col items-center justify-center" style={{ backgroundColor: '#4d535b', borderColor: '#5c636a' }}>
            <span className="text-sm font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>Check-ins Aujourd'hui:</span>
            <span className="text-2xl font-semibold text-white mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {statsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.checkInsToday ?? 0}
            </span>
          </div>
          <div className="rounded-lg p-3 border shadow-sm flex flex-col items-center justify-center" style={{ backgroundColor: '#4d535b', borderColor: '#5c636a' }}>
            <span className="text-sm font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>Revenu Total:</span>
            <span className="text-2xl font-semibold text-white mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {statsLoading ? '—' : formatMoney(stats?.totalRevenue ?? 0)}
            </span>
          </div>
          <div className="rounded-lg p-3 border shadow-sm flex flex-col items-center justify-center" style={{ backgroundColor: '#4d535b', borderColor: '#5c636a' }}>
            <span className="text-sm font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>En attente:</span>
            <span className="text-2xl font-semibold text-white mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {statsLoading ? '—' : stats?.pendingConfirmation ?? 0}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
