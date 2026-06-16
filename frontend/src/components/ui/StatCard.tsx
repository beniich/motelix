import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  gradient?: 'a' | 'b' | 'gold';
};

const gradientStyles = {
  a: {
    background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
    color: '#0a66c2',
    border: '1px solid rgba(59,130,246,0.15)',
  },
  b: {
    background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))',
    color: '#10B981',
    border: '1px solid rgba(16,185,129,0.15)',
  },
  gold: {
    background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(245,232,184,0.2))',
    color: '#d4a14a',
    border: '1px solid rgba(212,175,55,0.15)',
  },
};

export function StatCard({ label, value, icon: Icon, trend, gradient = 'a' }: Props) {
  return (
    <GlassCard className="group hover:-translate-y-0.5 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-light text-gray-900">
            {value}
          </p>
          {trend && (
            <p
              className={clsx('mt-2 text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-500')}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs hier
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl flex items-center justify-center" style={gradientStyles[gradient]}>
          <Icon className="w-5 h-5" style={{ color: gradientStyles[gradient].color }} />
        </div>
      </div>
    </GlassCard>
  );
}
