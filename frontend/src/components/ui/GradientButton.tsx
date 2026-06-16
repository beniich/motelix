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

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #0a66c2, #2563eb)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(10,102,194,0.3)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.6)',
    color: '#374151',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  gold: {
    background: 'linear-gradient(135deg, #D4AF37, #d4a14a)',
    color: '#1a1a1a',
    boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
  },
  ghost: {
    background: 'transparent',
    color: '#374151',
  },
  outline: {
    background: 'transparent',
    color: '#d4a14a',
    border: '1px solid rgba(212,175,55,0.5)',
  },
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
        'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300',
        'transform hover:scale-[1.02] active:scale-[0.98]',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3 text-base',
        variant === 'ghost' && 'hover:bg-gray-100',
        variant === 'outline' && 'hover:border-amber-400',
        className
      )}
      style={variantStyles[variant]}
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
