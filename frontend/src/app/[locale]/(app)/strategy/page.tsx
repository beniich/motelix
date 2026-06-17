// @ts-nocheck
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Euro, BedDouble, BarChart3, Sparkles, Download, Loader2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { GlassCard } from '@/components/ui/GlassCard';
import { Select } from '@/components/ui/Select';
import { useMetrics, PRESETS, useForecast, usePricing, type MetricsPreset } from '@/hooks/useAnalytics';

const SOURCE_LABELS: Record<string, string> = {
  DIRECT: 'Direct', WEBSITE: 'Site web', BOOKING_COM: 'Booking.com',
  EXPEDIA: 'Expedia', AIRBNB: 'Airbnb', AGENT: 'Agence', OTHER: 'Autre',
};

const SOURCE_COLORS = ['#D4AF37', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

export default function StrategyDashboard() {
  const [preset, setPreset] = useState<MetricsPreset>('30d');
  const [pricingDays, setPricingDays] = useState(7);
  
  const { data: metrics, isLoading: metricsLoading } = useMetrics(preset);
  const { data: forecast } = useForecast(30);
  const { data: pricing } = usePricing(pricingDays);
  
  if (metricsLoading || !metrics) {
    return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>;
  }
  
  const formatEur = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
  const formatPct = (v: number) => `${(v * 100).toFixed(1)}%`;
  
  const chartData = metrics.daily.map((d) => ({
    date: format(parseISO(d.date), 'd MMM', { locale: frLocale }),
    revpar: Math.round(d.revpar),
    adr: Math.round(d.adr),
    occupancy: d.occupancyRate * 100,
  }));
  
  const exportCSV = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/analytics-v2/export?days=90`, {
      credentials: 'include',
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-400" />
            Strategic Intelligence
          </h1>
          <p className="text-sm text-muted mt-1">{metrics.days} jours d'analyse</p>
        </div>
        <div className="flex gap-2">
          <Select value={preset} onChange={(e) => setPreset(e.target.value as MetricsPreset)} options={PRESETS} className="w-44" />
          <button onClick={exportCSV} className="px-3 py-2 rounded-lg bg-tertiary border border-black text-primary text-sm flex items-center gap-1.5 hover:border-cyan-500/50">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="Taux d'occupation" value={formatPct(metrics.occupancyRate)} change={metrics.occupancyRateChange} icon={BedDouble} gradient="cyan" />
        <KPICard label="ADR" value={formatEur(metrics.averageDailyRate)} change={metrics.adrChange} icon={Euro} gradient="gold" />
        <KPICard label="RevPAR" value={formatEur(metrics.revenuePerAvailableRoom)} change={metrics.revparChange} icon={BarChart3} gradient="purple" />
        <KPICard label="Revenu total" value={formatEur(metrics.totalRevenue)} icon={TrendingUp} gradient="cyan" />
      </div>
      
      {/* Time series */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-primary mb-4">RevPAR & occupation dans le temps</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revparG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="occupG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
              <YAxis yAxisId="left" stroke="#D4AF37" fontSize={10} tickFormatter={(v) => `${v}€`} />
              <YAxis yAxisId="right" orientation="right" stroke="#8B5CF6" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8 }}
                labelStyle={{ color: '#111827' }}
                formatter={(value: any, name: string) => {
                  if (name === 'Occupation') return [`${value.toFixed(0)}%`, name];
                  return [`${value}€`, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="revpar" stroke="#D4AF37" strokeWidth={2} fill="url(#revparG)" name="RevPAR" />
              <Area yAxisId="right" type="monotone" dataKey="occupancy" stroke="#8B5CF6" strokeWidth={2} fill="url(#occupG)" name="Occupation" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
      
      <div className="grid lg:grid-cols-2 gap-4">
        {/* By room type */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-primary mb-4">Par type de chambre</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.byRoomType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" stroke="#6b7280" fontSize={11} />
                <YAxis type="category" dataKey="type" stroke="#6b7280" fontSize={11} width={100} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8 }} formatter={(v: number) => `${Math.round(v)}€`} />
                <Bar dataKey="revpar" radius={[0, 4, 4, 0]}>
                  {metrics.byRoomType.map((_, i) => (
                    <Cell key={i} fill="url(#goldBarG)" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="goldBarG" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#F5E8B8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        
        {/* By source */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-primary mb-4">Par canal</h2>
          <div className="space-y-2">
            {metrics.bySource.map((s, i) => (
              <div key={s.source} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-secondary">{SOURCE_LABELS[s.source] ?? s.source}</span>
                  <span className="text-primary font-mono">{formatEur(s.revenue)} <span className="text-muted">({(s.percentage * 100).toFixed(0)}%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-tertiary overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.percentage * 100}%`, background: SOURCE_COLORS[i % SOURCE_COLORS.length], boxShadow: `0 0 8px ${SOURCE_COLORS[i % SOURCE_COLORS.length]}` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      
      {/* Forecast */}
      {forecast && (
        <GlassCard>
          <h2 className="text-sm font-semibold text-primary mb-2">Prévisions sur 30 jours</h2>
          <p className="text-xs text-muted mb-4">
            Occupation prévue moyenne : <span className="text-cyan-400 font-semibold">{(forecast.historicalAverage.occupancy * 100).toFixed(0)}%</span> •
            ADR prévu : <span className="text-amber-400 font-semibold">{Math.round(forecast.historicalAverage.adr)}€</span>
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast.forecast.map(f => ({ date: format(parseISO(f.date), 'd MMM', { locale: frLocale }), occupancy: f.occupancyRate * 100, confidence: f.confidence * 100 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={9} interval={3} />
                <YAxis yAxisId="left" stroke="#8B5CF6" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8 }} formatter={(v: number) => `${v.toFixed(0)}%`} />
                <Line yAxisId="left" type="monotone" dataKey="occupancy" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Occupation prévue" />
                <Line yAxisId="right" type="monotone" dataKey="confidence" stroke="#10B981" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Confiance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}
      
      {/* Pricing recommendations */}
      {pricing && pricing.recommendations.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-primary">Recommandations tarifaires</h2>
            <Select value={String(pricingDays)} onChange={(e) => setPricingDays(Number(e.target.value))} options={[
              { value: '7', label: '7 jours' },
              { value: '14', label: '14 jours' },
              { value: '30', label: '30 jours' },
            ]} className="w-32" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted border-b border-black">
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2 text-right">Base</th>
                  <th className="py-2 px-2 text-right">Recommandé</th>
                  <th className="py-2 px-2 text-right">Δ</th>
                  <th className="py-2 px-2">Raison</th>
                </tr>
              </thead>
              <tbody>
                {pricing.recommendations.slice(0, 14).map((r, i) => (
                  <tr key={i} className="border-b border-black/50">
                    <td className="py-2 px-2 text-secondary font-mono text-xs">{format(parseISO(r.date), 'EEE d MMM', { locale: frLocale })}</td>
                    <td className="py-2 px-2 text-primary">{r.roomType}</td>
                    <td className="py-2 px-2 text-right text-muted font-mono">{r.basePrice}€</td>
                    <td className="py-2 px-2 text-right text-amber-400 font-semibold font-mono">{r.recommendedPrice}€</td>
                    <td className="py-2 px-2 text-right">
                      <span className={r.priceChange > 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {r.priceChange > 0 ? '+' : ''}{r.priceChange.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 px-2 text-muted text-xs">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function KPICard({ label, value, change, icon: Icon, gradient }: any) {
  const positive = change >= 0;
  const gradClass = { cyan: 'bg-gradient-electric', gold: 'bg-gradient-to-br from-amber-400 to-amber-600', purple: 'bg-gradient-to-br from-purple-500 to-pink-500' }[gradient as string];
  
  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted">{label}</p>
          <p className="text-2xl font-display font-bold text-primary mt-1">{value}</p>
          {change !== undefined && change !== 0 && (
            <p className={`text-xs mt-1 font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {positive ? '↑' : '↓'} {Math.abs(change * 100).toFixed(1)}% vs période préc.
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${gradClass}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}
