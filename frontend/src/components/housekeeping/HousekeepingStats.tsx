'use client';

import { TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { housekeepingApi } from '@/lib/api-client';
import { StatCard } from '@/components/ui/StatCard';

export function HousekeepingStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['housekeeping-stats'],
    queryFn: () => housekeepingApi.getMyStats(),
    refetchInterval: 60000,
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        label="À faire"
        value={data.pending}
        icon={Clock}
        gradient="a"
      />
      <StatCard
        label="En cours"
        value={data.inProgress}
        icon={TrendingUp}
        gradient="b"
      />
      <StatCard
        label="Terminées"
        value={data.completedToday}
        icon={CheckCircle}
        gradient="gold"
      />
      <StatCard
        label="En retard"
        value={data.overdue}
        icon={AlertTriangle}
        gradient={data.overdue > 0 ? 'a' : 'b'}
      />
    </div>
  );
}
