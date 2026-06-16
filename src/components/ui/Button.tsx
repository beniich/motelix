import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', glow = false, isLoading = false, children, disabled, ...props },
  ref
) {
  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }[size];

  const variantClass = {
    primary: 'bg-gradient-electric text-white',
    secondary: 'bg-tertiary text-primary border border-black',
    ghost: 'bg-transparent text-primary hover:bg-tertiary',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30',
  }[variant];

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'rounded-lg font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05060A]',
        sizeClass,
        variantClass,
        glow && 'glow-blue-strong animate-glow',
        'hover:translate-y-[-1px]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0',
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
});
