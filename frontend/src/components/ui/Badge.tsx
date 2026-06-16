import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';

const variantClass: Record<Variant, string> = {
  default: 'bg-white/10 text-midnight-100 border-white/10',
  success: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/20',
  warning: 'bg-amber-400/15 text-amber-300 border-amber-400/20',
  danger: 'bg-red-400/15 text-red-300 border-red-400/20',
  info: 'bg-sapphire-400/15 text-sapphire-400 border-sapphire-400/20',
  gold: 'bg-gold-400/15 text-gold-300 border-gold-400/20',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border',
        variantClass[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
