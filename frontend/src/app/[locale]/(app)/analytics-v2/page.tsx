'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Euro, BedDouble, BarChart3, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, Cell, PieChart, Pie } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { analyticsApi, type HotelMetrics } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { Select } from '@/components/ui/Select';
import { clsx } from 'clsx';

export default function BIAnalyticsPage() {
  const [preset, setPreset] = useState<'7d' | '30d' | '90d' | 'ytd' | '12m'>('30d');
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['bi', 'metrics', preset],
    queryFn: () => analyticsApi.getMetrics({ preset }),
  });
  
  if (isLoading || !metrics) {
    return <div className="p-8 text-midnight-200">Chargement des métriques…</div>;
  }
  
  const formatPercent = (v: number) => `${(v * 100).toFixed(1)}%`;
  const formatCurrency = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-midnight-50">BI Hôtelière</h1>
          <p className="mt-1 text-sm text-midnight-200">
            RevPAR, ADR, taux d'occupation • {metrics.days} jours
          </p>
        </div>
        <div className="w-48">
          <Select
            value={preset}
            onChange={(e) => setPreset(e.target.value as any)}
            options={[
              { value: '7d', label: '7 derniers jours' },
              { value: '30d', label: '30 derniers jours' },
              { value: '90d', label: '90 derniers jours' },
              { value: 'ytd', label: 'Année en cours' },
              { value: '12m', label: '12 derniers mois' },
            ]}
          />
        </div>
      </div>
      
      {/* KPI Cards avec tendances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Taux d'occupation"
          value={formatPercent(metrics.occupancyRate)}
          change={metrics.occupancyRateChange}
          icon={BedDouble}
          gradient="a"
        />
        <KPICard
          label="ADR (Prix moyen)"
          value={formatCurrency(metrics.averageDailyRate)}
          change={metrics.adrChange}
          icon={Euro}
          gradient="gold"
        />
        <KPICard
          label="RevPAR"
          value={formatCurrency(metrics.revenuePerAvailableRoom)}
          change={metrics.revparChange}
          icon={BarChart3}
          gradient="b"
        />
        <StatCard
          label="Revenu total"
          value={formatCurrency(metrics.totalRevenue)}
          icon={TrendingUp}
          gradient="a"
        />
      </div>
      
      {/* Time series : RevPAR + occupancy */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-midnight-100 mb-4">RevPAR et occupation dans le temps</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.daily.map(d => ({
              ...d,
              date: format(parseISO(d.date), 'd MMM', { locale: frLocale }),
              revpar: Math.round(d.revpar),
            }))}>
              <defs>
                <linearGradient id="revparGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="occupGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#8E96BD" fontSize={10} />
              <YAxis yAxisId="left" stroke="#D4AF37" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" stroke="#8B5CF6" fontSize={10} domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <Tooltip
                contentStyle={{ background: '#0A0E27', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8 }}
                labelStyle={{ color: '#F5E8B8' }}
                formatter={(((value: number, name: string) => {
                  if (name === 'Occupation') return [`${(value * 100).toFixed(0)}%`, name];
                  return [`${value}€`, name];
                }) as any)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="revpar" stroke="#D4AF37" strokeWidth={2} fill="url(#revparGradient)" name="RevPAR" />
              <Area yAxisId="right" type="monotone" dataKey="occupancyRate" stroke="#8B5CF6" strokeWidth={2} fill="url(#occupGradient)" name="Occupation" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
      
      {/* Par type de chambre + par source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <h2 className="text-sm font-semibold text-midnight-100 mb-4">Performance par type de chambre</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.byRoomType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#8E96BD" fontSize={11} />
                <YAxis type="category" dataKey="type" stroke="#8E96BD" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ background: '#0A0E27', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8 }}
                  formatter={(((value: number) => `${Math.round(value)}€`) as any)}
                />
                <Bar dataKey="revpar" fill="url(#goldGradient)" radius={[0, 4, 4, 0]} name="RevPAR" />
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
        
        <GlassCard>
          <h2 className="text-sm font-semibold text-midnight-100 mb-4">Répartition par canal de réservation</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.bySource.map(s => ({ name: channelLabel(s.source), value: s.revenue }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {metrics.bySource.map((_, i) => (
                    <Cell key={i} fill={['#D4AF37', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][i % 6]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0A0E27', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8 }}
                  formatter={(((value: number) => `${Math.round(value)}€`) as any)}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function KPICard({ label, value, change, icon: Icon, gradient }: any) {
  const positive = change >= 0;
  return (
    <GlassCard className="group hover:bg-white/[0.07]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-midnight-200 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-3xl font-display font-bold text-midnight-50">{value}</p>
          {change !== undefined && change !== 0 && (
            <div className={clsx(
              'mt-2 inline-flex items-center gap-1 text-xs font-medium',
              positive ? 'text-emerald-400' : 'text-red-400'
            )}>
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {positive ? '+' : ''}{(change * 100).toFixed(1)}% vs période préc.
            </div>
          )}
        </div>
        <div className={clsx(
          'p-3 rounded-xl',
          gradient === 'a' && 'bg-gradient-a shadow-glow-sapphire',
          gradient === 'b' && 'bg-gradient-b',
          gradient === 'gold' && 'bg-gradient-gold shadow-glow-gold',
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}

function channelLabel(source: string): string {
  const labels: Record<string, string> = {
    DIRECT: 'Direct', WEBSITE: 'Site web',
    BOOKING_COM: 'Booking.com', EXPEDIA: 'Expedia',
    AIRBNB: 'Airbnb', AGENT: 'Agence', OTHER: 'Autre',
  };
  return labels[source] ?? source;
}
