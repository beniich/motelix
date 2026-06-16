'use client';

import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        'relative inline-flex items-center justify-center gap-2 font-medium rounded-xl',
        'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'transform hover:scale-[1.02] active:scale-[0.98]',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3 text-base',
        variant === 'primary' &&
          'bg-gradient-primary text-white focus:ring-[#8B5CF6] shadow-[0_0_24px_rgba(139,92,246,0.35)]',
        variant === 'secondary' &&
          'glass text-[#E6E8F2] hover:bg-white/10 focus:ring-white/30',
        variant === 'gold' &&
          'text-[#0A0E27] focus:ring-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.35)]',
        variant === 'ghost' && 'text-[#E6E8F2] hover:bg-white/5',
        variant === 'outline' &&
          'glass text-[#D4AF37] border border-[rgba(212,175,55,0.5)] hover:border-[rgba(212,175,55,0.8)]',
        className
      )}
      style={
        variant === 'gold'
          ? { background: 'linear-gradient(135deg, #D4AF37, #F5E8B8)' }
          : undefined
      }
      {...rest}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
