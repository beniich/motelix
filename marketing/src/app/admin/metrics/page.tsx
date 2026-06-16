'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Target, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { Header } from '@/components/landing/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function useAdminApi(path: string) {
  return useQuery({
    queryKey: ['admin', path],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${path}`, { credentials: 'include' });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
  });
}

export default function MetricsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  
  if (typeof window !== 'undefined') {
    if (!token) setToken(localStorage.getItem('sapphire_admin_email'));
  }
  
  const { data: overview } = useAdminApi('/api/admin/metrics/overview');
  const { data: timeseries } = useAdminApi('/api/admin/metrics/timeseries?days=30');
  const { data: funnel } = useAdminApi('/api/admin/metrics/funnel?days=30');
  const { data: cohorts } = useAdminApi('/api/admin/metrics/cohorts');
  
  if (!overview) {
    return (
      <main>
        <Header />
        <div className="pt-32 px-6 text-center text-midnight-200">Chargement…</div>
      </main>
    );
  }
  
  const formatEur = (cents: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents / 100);
  
  const formatPct = (v: number) => `${v.toFixed(1)}%`;
  
  const tsData = (timeseries?.metrics ?? []).map((m: any) => ({
    date: format(parseISO(m.date.toString()), 'd MMM', { locale: frLocale }),
    mrr: m.mrrCents / 100,
    leads: m.leadsCreated,
    trials: m.trialsStarted,
  }));
  
  return (
    <div className="bg-[#0a0d14] min-h-screen text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Dashboard Revenus</h1>
          <a href={`${API_URL}/api/admin/metrics/export?days=90`}>
            <GradientButton variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
              Export CSV
            </GradientButton>
          </a>
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="MRR"
            value={formatEur(overview.kpis.mrrCents)}
            change={overview.kpis.mrrGrowth}
            icon={DollarSign}
            gradient="gold"
          />
          <KPICard
            label="ARR"
            value={formatEur(overview.kpis.arrCents)}
            icon={TrendingUp}
            gradient="a"
          />
          <KPICard
            label="Customers actifs"
            value={overview.kpis.activeCustomers}
            subValue={`+ ${overview.kpis.trialingCustomers} en essai`}
            icon={Users}
            gradient="b"
          />
          <KPICard
            label="Conversion"
            value={formatPct(overview.kpis.conversionRate)}
            subValue={`${overview.kpis.totalLeads} leads`}
            icon={Target}
            gradient="a"
          />
        </div>
        
        {/* Chart MRR */}
        <GlassCard className="mb-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Évolution MRR (30 jours)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tsData}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#8E96BD" fontSize={11} />
                <YAxis stroke="#8E96BD" fontSize={11} tickFormatter={(v) => `${v}€`} />
                <Tooltip
                  contentStyle={{ background: '#0A0E27', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8 }}
                  formatter={(v: any) => `${Number(v).toFixed(0)}€`}
                />
                <Area type="monotone" dataKey="mrr" stroke="#D4AF37" strokeWidth={2} fill="url(#mrrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        
        {/* Funnel */}
        {funnel && (
          <GlassCard className="mb-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Funnel d'acquisition (30j)</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Visitors', value: funnel.funnel.visitors, color: 'text-sky-400' },
                { label: 'Leads', value: funnel.funnel.leads, color: 'text-sky-500' },
                { label: 'Démos', value: funnel.funnel.demos, color: 'text-emerald-400' },
                { label: 'Essais', value: funnel.funnel.trials, color: 'text-amber-400' },
                { label: 'Payants', value: funnel.funnel.paid, color: 'text-gold-400' },
              ].map((step, i) => (
                <div key={step.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
                  <p className="text-xs text-slate-400">{step.label}</p>
                  <p className={`text-2xl font-bold ${step.color}`}>{step.value}</p>
                  {i > 0 && funnel.funnel.visitors > 0 && (
                    <p className="text-xs text-emerald-400 mt-1">
                      {((step.value / funnel.funnel.visitors) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}
        
        {/* Cohorts */}
        {cohorts?.cohorts && cohorts.cohorts.length > 0 && (
          <GlassCard>
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Cohortes de rétention</h2>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="text-xs text-slate-400">
                    <th className="text-left py-2 px-2">Cohorte</th>
                    <th className="text-left py-2 px-2">Taille</th>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={i} className="py-2 px-2">M{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohorts.cohorts.slice(-6).map((c: any) => (
                    <tr key={c.cohort} className="border-t border-white/5 hover:bg-white/[0.02]">
                      <td className="py-2 px-2 text-slate-300 font-mono">{c.cohort}</td>
                      <td className="py-2 px-2 text-slate-400">{c.size}</td>
                      {Array.from({ length: 12 }, (_, i) => {
                        const v = c[`m${i}`] ?? 0;
                        return (
                          <td key={i} className="py-2 px-2">
                            {c.size > 0 && (
                              <div
                                className="text-center text-xs font-medium rounded px-2 py-1"
                                style={{
                                  backgroundColor: `rgba(16, 185, 129, ${v / 100})`,
                                  color: v > 50 ? '#0A0E27' : '#F5E8B8',
                                }}
                              >
                                {v}%
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function KPICard({ label, value, change, subValue, icon: Icon, gradient }: any) {
  const positive = change >= 0;
  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-display font-bold text-white">{value}</p>
          {change !== undefined && change !== 0 && (
            <p className={`mt-1 text-xs font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {positive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% vs 30j préc.
            </p>
          )}
          {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${
          gradient === 'a' ? 'bg-gradient-to-br from-violet-500 to-indigo-600' :
          gradient === 'b' ? 'bg-gradient-to-br from-sky-400 to-indigo-500' :
          'bg-gradient-to-br from-amber-400 to-orange-500'
        }`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}
