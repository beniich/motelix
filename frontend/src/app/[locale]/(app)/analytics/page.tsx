'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { BedDouble, TrendingUp, Users, Wine } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { roomsApi, tasksApi, type Room, type Task, type RoomStatus } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';

const PIE_COLORS: Record<RoomStatus, string> = {
  AVAILABLE: '#10B981',
  OCCUPIED: '#8B5CF6',
  CLEANING: '#F59E0B',
  MAINTENANCE: '#EF4444',
};

export default function AnalyticsPage() {
  const t = useTranslations();

  const { data: rooms } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomsApi.list({ pageSize: 100 }),
  });
  const { data: tasks } = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: () => tasksApi.list({ pageSize: 100 }),
  });

  // Occupancy by floor
  const byFloor = (rooms?.items ?? []).reduce<Record<number, { floor: string; occupées: number; disponibles: number }>>(
    (acc, r) => {
      const key = `Étage ${r.floor}`;
      if (!acc[r.floor]) acc[r.floor] = { floor: key, occupées: 0, disponibles: 0 };
      if (r.status === 'OCCUPIED') acc[r.floor].occupées += 1;
      if (r.status === 'AVAILABLE') acc[r.floor].disponibles += 1;
      return acc;
    },
    {}
  );

  // Status distribution
  const statusDist = (rooms?.items ?? []).reduce<Record<RoomStatus, number>>(
    (acc, r) => { acc[r.status] = (acc[r.status] ?? 0) + 1; return acc; },
    { AVAILABLE: 0, OCCUPIED: 0, CLEANING: 0, MAINTENANCE: 0 }
  );
  const pieData = (Object.entries(statusDist) as [RoomStatus, number][])
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name: t(`rooms.status.${name}`), value }));

  // Tasks by priority
  const tasksByPriority = [1, 2, 3, 4, 5].map((p) => ({
    priority: `P${p}`,
    count: (tasks?.items ?? []).filter((task) => task.priority === p).length,
  }));

  // Revenue per room type
  const revenueByType = (rooms?.items ?? []).reduce<Record<string, number>>((acc, r) => {
    if (r.status === 'OCCUPIED') acc[r.type] = (acc[r.type] ?? 0) + r.price;
    return acc;
  }, {});
  const revenueData = Object.entries(revenueByType).map(([type, value]) => ({ type, value }));

  const occupancyRate = rooms?.items.length
    ? Math.round((statusDist.OCCUPIED / rooms.items.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{t('nav.analytics')}</h1>
        <p className="mt-1 text-sm text-gray-500">Vue d&apos;ensemble des performances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Taux d'occupation" value={`${occupancyRate}%`} icon={BedDouble} gradient="a" />
        <StatCard label="Chambres" value={rooms?.pagination.total ?? 0} icon={BedDouble} gradient="b" />
        <StatCard label="Tâches actives" value={(tasks?.items ?? []).filter((t) => t.status !== 'COMPLETED').length} icon={Users} gradient="gold" />
        <StatCard label="Revenu potentiel" value={`${revenueData.reduce((s, d) => s + d.value, 0)}€`} icon={TrendingUp} gradient="a" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <h2 className="text-sm font-semibold mb-4 text-gray-700">Occupation par étage</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.values(byFloor)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="floor" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', color: '#1a1a1a' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="disponibles" stackId="a" fill="#10B981" name="Disponibles" radius={[0, 0, 0, 0]} />
                <Bar dataKey="occupées" stackId="a" fill="#8B5CF6" name="Occupées" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold mb-4 text-gray-700">Répartition des statuts</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {pieData.map((entry, i) => {
                    const status = (Object.keys(statusDist) as RoomStatus[]).find(
                      (k) => t(`rooms.status.${k}`) === entry.name
                    );
                    return <Cell key={i} fill={status ? PIE_COLORS[status] : '#3B82F6'} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', color: '#1a1a1a' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold mb-4 text-gray-700">Tâches par priorité</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tasksByPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="priority" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', color: '#1a1a1a' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  dot={{ fill: '#D4AF37', r: 4 }}
                  activeDot={{ r: 6, fill: '#F5E8B8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold mb-4 text-gray-700">Revenu par type de chambre</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                <YAxis type="category" dataKey="type" stroke="#9ca3af" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', color: '#1a1a1a' }}
                  formatter={(v: any) => `${v}€`}
                />
                <Bar dataKey="value" fill="url(#goldGradient)" radius={[0, 4, 4, 0]} />
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#F5E8B8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
