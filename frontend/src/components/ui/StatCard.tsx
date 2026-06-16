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
    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    boxShadow: '0 0 24px rgba(139,92,246,0.35)',
  },
  b: {
    background: 'linear-gradient(135deg, #10B981, #06B6D4)',
  },
  gold: {
    background: 'linear-gradient(135deg, #D4AF37, #F5E8B8)',
    boxShadow: '0 0 24px rgba(212,175,55,0.35)',
  },
};

export function StatCard({ label, value, icon: Icon, trend, gradient = 'a' }: Props) {
  return (
    <GlassCard className="group hover:bg-white/[0.07] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#8E96BD' }}>
            {label}
          </p>
          <p
            className="mt-2 text-3xl font-semibold"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#E6E8F2' }}
          >
            {value}
          </p>
          {trend && (
            <p
              className={clsx('mt-2 text-xs font-medium', trend.positive ? 'text-[#10B981]' : 'text-red-400')}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs hier
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl" style={gradientStyles[gradient]}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}
