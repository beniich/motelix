import { clsx } from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';
import type { ReactNode } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const GlassInput = forwardRef<HTMLInputElement, Props>(function GlassInput(
  { label, error, leftIcon, rightIcon, className, id, ...rest },
  ref
) {
  const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, '-') ?? Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full py-2.5 rounded-xl text-gray-800 text-sm',
            'bg-white/80 border border-gray-200',
            leftIcon ? 'pl-11 pr-4' : 'px-4',
            rightIcon ? 'pr-11' : '',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400',
            'transition-all duration-200',
            error && 'border-red-400 focus:ring-red-200',
            className
          )}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
});
