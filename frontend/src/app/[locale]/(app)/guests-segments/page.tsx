'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Crown, AlertTriangle, UserCheck, Star, UserMinus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { segmentationApi } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { clsx } from 'clsx';
import { Badge } from '@/components/ui/Badge';

const SEGMENT_COLORS: Record<string, string> = {
  VIP: '#D4AF37',       // Gold
  REGULAR: '#3B82F6',   // Blue
  NEW: '#10B981',       // Emerald
  OCCASIONAL: '#8B5CF6',// Purple
  AT_RISK: '#F59E0B',   // Amber
  LOST: '#EF4444',      // Red
};

const SEGMENT_ICONS: Record<string, any> = {
  VIP: Crown,
  REGULAR: UserCheck,
  NEW: Star,
  OCCASIONAL: Users,
  AT_RISK: AlertTriangle,
  LOST: UserMinus,
};

export default function GuestSegmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['segmentation'],
    queryFn: () => segmentationApi.getSegments(),
  });
  
  if (isLoading || !data) return <div className="p-8 text-midnight-200">Chargement…</div>;
  
  const formatCurrency = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
  
  const chartData = Object.entries(data.segments).map(([key, val]: [string, any]) => ({
    name: key,
    count: val.count,
    revenue: val.revenue,
    color: SEGMENT_COLORS[key],
  })).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold text-midnight-50">Segmentation Clients (RFM)</h1>
        <p className="mt-1 text-sm text-midnight-200">
          Analyse de la base clients et recommandations d'actions marketing
        </p>
      </div>
      
      {/* Graphique de répartition du revenu par segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard>
            <h2 className="text-sm font-semibold text-midnight-100 mb-4">Revenu généré par segment</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#8E96BD" fontSize={11} tickFormatter={(v) => `${v / 1000}k€`} />
                  <YAxis type="category" dataKey="name" stroke="#8E96BD" fontSize={11} width={80} />
                  <Tooltip
                    contentStyle={{ background: '#0A0E27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    formatter={(((value: number, name: string) => [
                      name === 'Revenu' ? formatCurrency(value) : value, 
                      name
                    ]) as any)}
                  />
                  <Bar dataKey="revenue" name="Revenu" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
        
        <div className="space-y-4">
          <StatCard
            label="Total Clients Segmentés"
            value={data.guests.length}
            icon={Users}
            gradient="a"
          />
          <StatCard
            label="Revenu VIP & Fidèles"
            value={formatCurrency((data.segments.VIP?.revenue || 0) + (data.segments.REGULAR?.revenue || 0))}
            icon={Crown}
            gradient="gold"
          />
        </div>
      </div>
      
      {/* Liste des profils */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-midnight-100 mb-4">Base Clients Actionnable</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-midnight-200">
            <thead className="text-xs uppercase bg-white/5 text-midnight-300">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Client</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Séjours</th>
                <th className="px-4 py-3">Revenu</th>
                <th className="px-4 py-3">Dernier séjour</th>
                <th className="px-4 py-3 rounded-tr-lg">Action recommandée (Top 1)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.guests.slice(0, 50).map((g: any) => {
                const Icon = SEGMENT_ICONS[g.segment] || Users;
                return (
                  <tr key={g.guestId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-midnight-50">
                      {g.firstName} {g.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5" style={{ color: SEGMENT_COLORS[g.segment] }}>
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-xs">{g.segmentLabel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{g.totalStays}</td>
                    <td className="px-4 py-3 font-medium text-midnight-50">{formatCurrency(g.totalRevenue)}</td>
                    <td className="px-4 py-3">
                      {g.daysSinceLastStay !== null ? `Il y a ${g.daysSinceLastStay}j` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {g.recommendedActions[0] && (
                        <span className="inline-block px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
                          💡 {g.recommendedActions[0]}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
