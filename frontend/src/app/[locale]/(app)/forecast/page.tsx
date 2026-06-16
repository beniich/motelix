'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Area, ComposedChart } from 'recharts';
import { format, addDays, parseISO } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { analyticsApi } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { Select } from '@/components/ui/Select';
import { clsx } from 'clsx';

export default function ForecastPage() {
  const [days, setDays] = useState(30);
  
  const { data: forecast } = useQuery({
    queryKey: ['forecast', days],
    queryFn: () => analyticsApi.getForecast(days),
  });
  
  const { data: pricing } = useQuery({
    queryKey: ['pricing', days],
    queryFn: () => analyticsApi.getPricing(days),
  });
  
  if (!forecast) return <div className="p-8 text-midnight-200">Chargement…</div>;
  
  // Grouper les recommandations de pricing par jour
  const pricingByDate = new Map<string, any[]>();
  pricing?.recommendations.forEach((r: any) => {
    if (!pricingByDate.has(r.date)) pricingByDate.set(r.date, []);
    pricingByDate.get(r.date)!.push(r);
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold text-midnight-50 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-gold-400" />
          Prévisions & Pricing
        </h1>
        <p className="mt-1 text-sm text-midnight-200">
          Demande prévue et recommandations tarifaires
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-40">
          <Select
            value={String(days)}
            onChange={(e) => setDays(Number(e.target.value))}
            options={[
              { value: '7', label: '7 jours' },
              { value: '14', label: '14 jours' },
              { value: '30', label: '30 jours' },
              { value: '60', label: '60 jours' },
              { value: '90', label: '90 jours' },
            ]}
          />
        </div>
      </div>
      
      {/* Stats baseline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          label="Occupation moyenne (30j)"
          value={`${(forecast.historicalAverage.occupancy * 100).toFixed(0)}%`}
          icon={TrendingUp}
          gradient="a"
        />
        <StatCard
          label="ADR moyen (30j)"
          value={`${Math.round(forecast.historicalAverage.adr)}€`}
          icon={TrendingUp}
          gradient="gold"
        />
      </div>
      
      {/* Forecast chart */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-midnight-100 mb-4">
          Prévision d'occupation sur {days} jours
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecast.forecast.map((f: any) => ({
              ...f,
              date: format(parseISO(f.date), 'd MMM', { locale: frLocale }),
              occupancyPct: f.occupancyRate * 100,
            }))}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#8E96BD" fontSize={10} interval="preserveStartEnd" />
              <YAxis yAxisId="occ" stroke="#8E96BD" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis yAxisId="adr" orientation="right" stroke="#D4AF37" fontSize={10} tickFormatter={(v) => `${v}€`} />
              <Tooltip
                contentStyle={{ background: '#0A0E27', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8 }}
                formatter={(((value: number, name: string) => {
                  if (name === 'Occupation prévue') return [`${value.toFixed(0)}%`, name];
                  if (name === 'ADR prévu') return [`${value.toFixed(0)}€`, name];
                  return [value, name];
                }) as any)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine yAxisId="occ" y={80} stroke="#10B981" strokeDasharray="2 2" label={{ value: 'Seuil fort', fill: '#10B981', fontSize: 10 }} />
              <ReferenceLine yAxisId="occ" y={30} stroke="#EF4444" strokeDasharray="2 2" label={{ value: 'Seuil faible', fill: '#EF4444', fontSize: 10 }} />
              <Area yAxisId="occ" type="monotone" dataKey="occupancyPct" stroke="#8B5CF6" strokeWidth={2} fill="url(#forecastGrad)" name="Occupation prévue" />
              <Line yAxisId="adr" type="monotone" dataKey="adr" stroke="#D4AF37" strokeWidth={2} dot={false} name="ADR prévu" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
      
      {/* Recommandations de prix */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-midnight-100 mb-4">Recommandations tarifaires</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-2">
          {Array.from(pricingByDate.entries()).slice(0, 14).map(([date, recs]) => (
            <div key={date} className="glass rounded-xl p-3 border border-white/5 bg-white/5">
              <p className="text-sm font-semibold text-midnight-50 mb-2">
                {format(parseISO(date), 'EEEE d MMMM', { locale: frLocale })}
              </p>
              <div className="space-y-1">
                {recs.map(r => (
                  <div key={r.roomType} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-1 border-b border-white/5 last:border-0">
                    <span className="text-midnight-200">{r.roomType}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-midnight-300 line-through text-xs">{r.basePrice}€</span>
                      <span className={clsx('font-semibold', 
                        r.priceChange > 0 ? 'text-emerald-400' : 'text-amber-400'
                      )}>
                        {r.recommendedPrice}€
                      </span>
                      <span className={clsx('text-xs min-w-[32px] text-right',
                        r.priceChange > 0 ? 'text-emerald-400' : 'text-amber-400'
                      )}>
                        {r.priceChange > 0 ? '+' : ''}{r.priceChange.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-midnight-300 mt-2">💡 {recs[0].reason}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
