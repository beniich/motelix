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
  const baseStyle = {
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.6)',
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
  };

  const strongStyle = {
    background: 'rgba(255,255,255,0.70)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    border: '1px solid rgba(255,255,255,0.75)',
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
  };

  const goldStyle = {
    background: 'linear-gradient(135deg, rgba(212,175,55,0.10), rgba(212,175,55,0.05))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(212,175,55,0.22)',
    boxShadow: glow ? '0 0 24px rgba(212,175,55,0.25)' : '0 4px 20px rgba(0,0,0,0.05)',
  };

  const style =
    variant === 'gold'   ? goldStyle   :
    variant === 'strong' ? strongStyle :
    baseStyle;

  return (
    <div
      className={clsx(
        'rounded-2xl p-6 transition-all duration-300',
        gradientBorder && 'gradient-border',
        className
      )}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
