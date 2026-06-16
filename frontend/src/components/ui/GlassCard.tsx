import { clsx } from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'strong' | 'gold';

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: Variant;
  glow?: boolean;
  gradientBorder?: boolean;
};

export function GlassCard({
  children,
  variant = 'default',
  glow = false,
  gradientBorder = false,
  className,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl p-6 transition-all duration-300',
        variant === 'default' && 'glass',
        variant === 'strong' && 'glass-strong',
        variant === 'gold' && 'glass-gold',
        glow && 'shadow-[0_0_24px_rgba(212,175,55,0.35)]',
        gradientBorder && 'gradient-border',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
