'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { BedDouble, ListTodo, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { StatCard } from '@/components/ui/StatCard';
import { GlassCard } from '@/components/ui/GlassCard';

type RoomsResponse = {
  items: Array<{ id: string; status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE'; number: string; floor: number }>;
  pagination: { total: number };
};

type TasksResponse = {
  items: Array<{ id: string; status: string; title: string; priority: string }>;
  pagination: { total: number };
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE:   '#10B981',
  OCCUPIED:    '#3B82F6',
  CLEANING:    '#D4AF37',
  MAINTENANCE: '#EF4444',
};

const TASK_COLORS: Record<string, string> = {
  PENDING:     '#D4AF37',
  IN_PROGRESS: '#3B82F6',
  COMPLETED:   '#10B981',
  CANCELLED:   '#6B7280',
};

export default function DashboardPage() {
  const t = useTranslations();
  const { user } = useAuth();

  const { data: rooms } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: async () => (await api.get<RoomsResponse>('/api/rooms?pageSize=100')).data,
    enabled: !!user,
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: async () => (await api.get<TasksResponse>('/api/tasks?pageSize=100')).data,
    enabled: !!user,
  });

  const total     = rooms?.pagination.total ?? 0;
  const occupied  = rooms?.items.filter((r) => r.status === 'OCCUPIED').length ?? 0;
  const available = rooms?.items.filter((r) => r.status === 'AVAILABLE').length ?? 0;
  const cleaning  = rooms?.items.filter((r) => r.status === 'CLEANING').length ?? 0;
  const pending   = tasks?.items.filter((tk) => tk.status === 'PENDING').length ?? 0;
  const inProgress = tasks?.items.filter((tk) => tk.status === 'IN_PROGRESS').length ?? 0;

  const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: 'var(--font-playfair), serif', color: '#E6E8F2' }}
        >
          {t('dashboard.welcome', { name: user?.firstName ?? '' })}
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#8E96BD' }}>
          {user?.hotel?.name ?? 'Sapphire Hotel Operations'}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t('dashboard.roomsAvailable')}
          value={available}
          icon={BedDouble}
          gradient="b"
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          label={t('dashboard.roomsOccupied')}
          value={occupied}
          icon={BedDouble}
          gradient="a"
        />
        <StatCard
          label={t('dashboard.tasksPending')}
          value={pending}
          icon={ListTodo}
          gradient="gold"
        />
        <StatCard
          label={t('dashboard.revenue')}
          value="€4 280"
          icon={TrendingUp}
          gradient="a"
          trend={{ value: 12, positive: true }}
        />
      </div>

      {/* Live Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room status breakdown */}
        <GlassCard>
          <h2
            className="text-lg font-semibold mb-5"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#E6E8F2' }}
          >
            {t('dashboard.liveOperations')}
          </h2>

          {/* Occupancy bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2" style={{ color: '#8E96BD' }}>
              <span>Occupation</span>
              <span style={{ color: '#D4AF37' }} className="font-medium">{occupancyPct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${occupancyPct}%`,
                  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                }}
              />
            </div>
          </div>

          {/* Status pills */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { label: t('rooms.status.AVAILABLE'),   count: available, status: 'AVAILABLE' },
                { label: t('rooms.status.OCCUPIED'),    count: occupied,  status: 'OCCUPIED' },
                { label: t('rooms.status.CLEANING'),    count: cleaning,  status: 'CLEANING' },
                { label: t('rooms.status.MAINTENANCE'), count: total - available - occupied - cleaning, status: 'MAINTENANCE' },
              ] as const
            ).map(({ label, count, status }) => (
              <div
                key={status}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: STATUS_COLORS[status] }}
                  />
                  <span className="text-sm" style={{ color: '#8E96BD' }}>{label}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#E6E8F2' }}>{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent tasks */}
        <GlassCard>
          <h2
            className="text-lg font-semibold mb-5"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#E6E8F2' }}
          >
            {t('tasks.title')}
          </h2>

          <div className="space-y-2">
            {inProgress > 0 && (
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#3B82F6' }} />
                  <span className="text-sm" style={{ color: '#C2C7DC' }}>
                    {t('tasks.status.IN_PROGRESS')}
                  </span>
                </div>
                <span className="font-semibold" style={{ color: '#3B82F6' }}>{inProgress}</span>
              </div>
            )}

            {tasks?.items.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-sm truncate flex-1 pr-2" style={{ color: '#C2C7DC' }}>
                  {task.title}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                  style={{
                    background: `${TASK_COLORS[task.status] ?? '#6B7280'}22`,
                    color: TASK_COLORS[task.status] ?? '#6B7280',
                    border: `1px solid ${TASK_COLORS[task.status] ?? '#6B7280'}44`,
                  }}
                >
                  {t(`tasks.status.${task.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'}`)}
                </span>
              </div>
            ))}

            {(!tasks?.items.length) && (
              <p className="text-sm text-center py-4" style={{ color: '#5A659E' }}>
                Aucune tâche pour le moment
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
