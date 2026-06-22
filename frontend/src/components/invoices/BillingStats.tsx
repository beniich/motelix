'use client';

import { TrendingUp, TrendingDown, Clock, AlertTriangle, DollarSign, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/api-client';
import { StatCard } from '@/components/ui/StatCard';

interface BillingStatsData {
  month: {
    invoicedCents: number;
    collectedCents: number;
    revenueGrowthCents: number;
    growthPercent: number;
  };
  outstanding: {
    totalDueCents: number;
    overdueCount: number;
  };
  byPaymentMethod?: Record<string, { count: number; totalCents: number }>;
}

export function BillingStats() {
  const { data, isLoading } = useQuery<BillingStatsData>({
    queryKey: ['billing-stats'],
    queryFn: () => api.get<any>('/api/billing/stats').then((r) => r.data?.stats ?? r.data),
    staleTime: 60_000,
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const collectedPct = data.month.invoicedCents > 0
    ? Math.round((data.month.collectedCents / data.month.invoicedCents) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="CA du mois"
        value={formatMoney(data.month.invoicedCents)}
        icon={DollarSign}
        trend={{ value: collectedPct, positive: true }}
        gradient="gold"
      />
      <StatCard
        label="Croissance"
        value={`${data.month.growthPercent >= 0 ? '+' : ''}${data.month.growthPercent}%`}
        icon={data.month.growthPercent >= 0 ? TrendingUp : TrendingDown}
        gradient={data.month.growthPercent >= 0 ? 'b' : 'a'}
      />
      <StatCard
        label="Montant en attente"
        value={formatMoney(data.outstanding.totalDueCents)}
        icon={Clock}
        gradient="a"
      />
      <StatCard
        label="Factures en retard"
        value={String(data.outstanding.overdueCount)}
        icon={AlertTriangle}
        gradient={data.outstanding.overdueCount > 0 ? 'gold' : 'b'}
      />
    </div>
  );
}
