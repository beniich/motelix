import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
  glow?: boolean;
}

export function Badge({ variant = 'default', glow = false, className, children, ...props }: BadgeProps) {
  const variantClass = {
    default: 'bg-tertiary text-secondary',
    success: 'bg-emerald-500/15 text-emerald-300',
    warning: 'bg-amber-500/15 text-amber-300',
    danger: 'bg-red-500/15 text-red-300',
    info: 'bg-cyan-500/15 text-cyan-300',
    gold: 'bg-amber-500/15 text-amber-300',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider',
        'border border-black',
        variantClass,
        glow && 'glow-blue-subtle',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
