import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Variant = 'default' | 'strong' | 'gold';

export function GlassCard({
  children, variant = 'default', className,
}: { children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <div className={cn(
      'rounded-2xl p-6',
      variant === 'default' && 'glass',
      variant === 'strong' && 'glass-strong',
      variant === 'gold' && 'glass-gold',
      className
    )}>
      {children}
    </div>
  );
}
