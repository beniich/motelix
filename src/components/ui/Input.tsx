import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg text-primary',
          'bg-tertiary border border-black',
          'placeholder:text-muted',
          'focus:outline-none focus:border-[#00D4FF] focus:glow-blue-subtle',
          'transition-all',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
});
