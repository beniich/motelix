'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { BedDouble, ListTodo, TrendingUp, Clock, Users, Star, Zap, CalendarDays } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

type RoomsResponse = {
  items: Array<{ id: string; status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE'; number: string; floor: number }>;
  pagination: { total: number };
};

type TasksResponse = {
  items: Array<{ id: string; status: string; title: string; priority: string }>;
  pagination: { total: number };
};

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  AVAILABLE:   { dot: '#10B981', bg: 'rgba(16,185,129,0.08)',  text: '#065f46' },
  OCCUPIED:    { dot: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  text: '#1e40af' },
  CLEANING:    { dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  text: '#92400e' },
  MAINTENANCE: { dot: '#EF4444', bg: 'rgba(239,68,68,0.08)',   text: '#991b1b' },
};

const TASK_COLORS: Record<string, string> = {
  PENDING:     '#f59e0b',
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
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-4 text-gray-800">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-light tracking-tight text-gray-900">
          {t('dashboard.welcome', { name: user?.firstName ?? '' })}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{user?.hotel?.name ?? 'Zafir Hotel Operations'}</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('dashboard.roomsAvailable'), value: available, icon: BedDouble, color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
          { label: t('dashboard.roomsOccupied'),  value: occupied,  icon: BedDouble, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)' },
          { label: t('dashboard.tasksPending'),   value: pending,   icon: ListTodo,  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
          { label: t('dashboard.revenue'),        value: '€4 280',  icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className="rounded-3xl p-5 flex flex-col gap-4" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)' }}>
            <div className="flex justify-between items-start">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: bg, border: `1px solid ${border}` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-light text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Status Breakdown */}
        <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-5">{t('dashboard.liveOperations')}</h2>

          {/* Occupancy Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Taux d&apos;occupation</span>
              <span className="font-semibold text-blue-600">{occupancyPct}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${occupancyPct}%`, background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }} />
            </div>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            {([ 
              { label: t('rooms.status.AVAILABLE'),   count: available, status: 'AVAILABLE' },
              { label: t('rooms.status.OCCUPIED'),    count: occupied,  status: 'OCCUPIED' },
              { label: t('rooms.status.CLEANING'),    count: cleaning,  status: 'CLEANING' },
              { label: t('rooms.status.MAINTENANCE'), count: total - available - occupied - cleaning, status: 'MAINTENANCE' },
            ] as const).map(({ label, count, status }) => (
              <div key={status} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: STATUS_COLORS[status].bg, border: `1px solid ${STATUS_COLORS[status].dot}22` }}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[status].dot }} />
                  <span className="text-sm" style={{ color: STATUS_COLORS[status].text }}>{label}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: STATUS_COLORS[status].text }}>{count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Tasks */}
        <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-5">{t('tasks.title')}</h2>

          <div className="space-y-2">
            {inProgress > 0 && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-700">{t('tasks.status.IN_PROGRESS')}</span>
                </div>
                <span className="font-semibold text-blue-600">{inProgress}</span>
              </div>
            )}

            {tasks?.items.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <span className="text-sm truncate flex-1 pr-2 text-gray-700">{task.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: `${TASK_COLORS[task.status] ?? '#6B7280'}18`, color: TASK_COLORS[task.status] ?? '#6B7280', border: `1px solid ${TASK_COLORS[task.status] ?? '#6B7280'}30` }}>
                  {t(`tasks.status.${task.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'}`)}
                </span>
              </div>
            ))}

            {(!tasks?.items.length) && (
              <p className="text-sm text-center py-4 text-gray-400">Aucune tâche pour le moment</p>
            )}
          </div>
        </section>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Arrivées du jour', icon: CalendarDays, color: '#0a66c2', count: 8 },
          { label: 'Guests VIP actifs', icon: Star, color: '#d4a14a', count: 3 },
          { label: 'Énergie (kWh)',  icon: Zap, color: '#10B981', count: '142' },
          { label: 'Équipes actives', icon: Users, color: '#8b5cf6', count: 12 },
        ].map(({ label, icon: Icon, color, count }) => (
          <div key={label} className="rounded-3xl p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-light text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
