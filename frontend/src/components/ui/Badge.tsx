import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';

const variantStyle: Record<Variant, React.CSSProperties> = {
  default: { background: 'rgba(0,0,0,0.06)', color: '#374151', border: '1px solid rgba(0,0,0,0.08)' },
  success: { background: 'rgba(16,185,129,0.1)', color: '#065f46', border: '1px solid rgba(16,185,129,0.2)' },
  warning: { background: 'rgba(245,158,11,0.1)', color: '#92400e', border: '1px solid rgba(245,158,11,0.2)' },
  danger:  { background: 'rgba(239,68,68,0.1)',  color: '#991b1b', border: '1px solid rgba(239,68,68,0.2)' },
  info:    { background: 'rgba(59,130,246,0.1)', color: '#1e40af', border: '1px solid rgba(59,130,246,0.2)' },
  gold:    { background: 'rgba(212,175,55,0.1)', color: '#92400e', border: '1px solid rgba(212,175,55,0.25)' },
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
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md',
        className
      )}
      style={variantStyle[variant]}
    >
      {children}
    </span>
  );
}
