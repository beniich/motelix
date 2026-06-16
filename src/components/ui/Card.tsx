import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'none' | 'blue' | 'purple' | 'cyan' | 'pink' | 'green' | 'gold';
  variant?: 'default' | 'elevated' | 'subtle';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, glow = 'none', variant = 'default', children, ...props },
  ref
) {
  const glowClass = {
    none: '',
    blue: 'glow-blue',
    purple: 'glow-purple',
    cyan: 'glow-cyan',
    pink: 'glow-pink',
    green: 'glow-green',
    gold: 'glow-gold',
  }[glow];

  const variantClass = {
    default: 'bg-secondary',
    elevated: 'bg-elevated',
    subtle: 'bg-tertiary',
  }[variant];

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-black p-6',
        variantClass,
        glowClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export function GlassCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/5 p-6',
        'bg-white/[0.03] backdrop-blur-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
