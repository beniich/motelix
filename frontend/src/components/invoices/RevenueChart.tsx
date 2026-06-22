'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { Select } from '@/components/ui/Select';
import { formatMoney } from '@/lib/api-client';

interface DataPoint { date: string; amount: number }

export function RevenueChart() {
  const [period, setPeriod] = useState('12m');
  const [data, setData]     = useState<DataPoint[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<any>('/api/billing/stats');
        const stats = res.data?.stats ?? res.data ?? {};

        // Build 12-month series with current month from API
        const today = new Date();
        const months: DataPoint[] = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
          months.push({
            date: label,
            amount: i === 0
              ? (stats.month?.invoicedCents ?? 0)
              : Math.floor(Math.random() * 700_000 + 350_000), // placeholder for past months
          });
        }
        setData(months);
      } catch {
        // silently fail – chart stays empty
      }
    }
    load();
  }, [period]);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Évolution du CA</h3>
        <div className="w-36">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: '12m', label: '12 mois' },
              { value: '6m',  label: '6 mois' },
              { value: '3m',  label: '3 mois' },
            ]}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `${Math.round(v / 100)}€`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v: any) => [formatMoney(v), 'CA facturé']}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.9)',
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              fontSize: 13,
            }}
          />
          <Bar
            dataKey="amount"
            fill="url(#barGrad)"
            radius={[6, 6, 0, 0]}
          />
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
