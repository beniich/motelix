'use client';

import { useQuery } from '@tanstack/react-query';
import { Building2, Users, BedDouble, TrendingUp, ChevronRight } from 'lucide-react';
import { useRouter, Link } from '@/i18n/routing';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { useHotelContext } from '@/lib/hotelContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type DashboardData = {
  hotelCount: number;
  userCount: number;
  activeReservations: number;
  revenueLast30: number;
  roomsByStatus: Array<{ status: string; _count: { id: number } }>;
  reservationsByHotel: Array<{
    hotelId: string;
    _count: { id: number };
    _sum: { totalPrice: number | null };
    hotel?: { id: string; name: string; city: string; country: string };
  }>;
  hotels: Array<{ id: string; name: string; city: string; country: string; stars: number }>;
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <GlassCard className="flex items-center gap-4 p-5">
      <div
        className="p-3 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm mt-0.5" style={{ color: '#8E96BD' }}>
          {label}
        </p>
      </div>
    </GlassCard>
  );
}

export default function SuperDashboardPage() {
  const router = useRouter();
  const { setCurrentHotel } = useHotelContext();

  const { data, isLoading } = useQuery({
    queryKey: ['super', 'dashboard'],
    queryFn: async () =>
      (await api.get<DashboardData>('/api/super/dashboard')).data,
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        Chargement du tableau de bord…
      </div>
    );
  }

  const chartData = data.reservationsByHotel
    .filter((r) => r.hotel)
    .map((r) => ({
      name: r.hotel!.name.length > 12 ? r.hotel!.name.slice(0, 12) + '…' : r.hotel!.name,
      reservations: r._count.id,
      revenue: Math.round(r._sum.totalPrice ?? 0),
    }));

  const tooltipStyle = {
    contentStyle: {
      background: '#0A0E27',
      border: '1px solid rgba(212,175,55,0.3)',
      borderRadius: 8,
      color: '#E6E8F2',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vue d&apos;ensemble groupe</h1>
          <p className="mt-1 text-sm" style={{ color: '#8E96BD' }}>
            {data.hotelCount} hôtel(s) — {data.userCount} utilisateurs actifs
          </p>
        </div>
        <Link
          href="/super/hotels"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            color: '#0A0E27',
          }}
        >
          <Building2 className="w-4 h-4" />
          Gérer les hôtels
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Hôtels"
          value={data.hotelCount}
          icon={Building2}
          color="linear-gradient(135deg,#3B82F6,#8B5CF6)"
        />
        <StatCard
          label="Utilisateurs actifs"
          value={data.userCount}
          icon={Users}
          color="linear-gradient(135deg,#10B981,#059669)"
        />
        <StatCard
          label="Réservations actives"
          value={data.activeReservations}
          icon={BedDouble}
          color="linear-gradient(135deg,#F59E0B,#D97706)"
        />
        <StatCard
          label="Revenu 30 derniers jours"
          value={`${data.revenueLast30.toLocaleString('fr-FR')} €`}
          icon={TrendingUp}
          color="linear-gradient(135deg,#D4AF37,#B8860B)"
        />
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Réservations par hôtel</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis type="number" stroke="#8E96BD" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#8E96BD"
                    fontSize={11}
                    width={90}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="reservations" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, i) => (
                      <rect key={i} fill="url(#sapphireGrad)" />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="sapphireGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Revenu par hôtel (30j)</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis type="number" stroke="#8E96BD" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#8E96BD"
                    fontSize={11}
                    width={90}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(v) => `${Number(v).toLocaleString('fr-FR')} €`}
                  />
                  <Bar dataKey="revenue" fill="url(#goldGrad)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#F5E8B8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Hotel list */}
      <GlassCard className="p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Hôtels du groupe</h2>
        <div className="space-y-2">
          {data.hotels.map((hotel) => {
            const stat = data.reservationsByHotel.find((r) => r.hotelId === hotel.id);
            return (
              <button
                key={hotel.id}
                onClick={() => {
                  setCurrentHotel(hotel);
                  router.push('/dashboard');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="p-2 rounded-lg shrink-0"
                  style={{ background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}
                >
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{hotel.name}</p>
                  <p className="text-xs" style={{ color: '#8E96BD' }}>
                    {hotel.city}, {hotel.country} &nbsp;·&nbsp; {'⭐'.repeat(hotel.stars)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
                    {(stat?._sum.totalPrice ?? 0).toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-xs" style={{ color: '#8E96BD' }}>
                    {stat?._count.id ?? 0} résas
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#8E96BD' }} />
              </button>
            );
          })}
          {data.hotels.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: '#8E96BD' }}>
              Aucun hôtel configuré.{' '}
              <Link href="/super/hotels" style={{ color: '#D4AF37' }}>
                Créer le premier →
              </Link>
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
