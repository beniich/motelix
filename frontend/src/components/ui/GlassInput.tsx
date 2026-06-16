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
        <label
          htmlFor={inputId}
          className="block text-sm font-medium mb-1.5"
          style={{ color: '#C2C7DC' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E96BD] pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full py-2.5 rounded-xl glass',
            leftIcon ? 'pl-11 pr-4' : 'px-4',
            rightIcon ? 'pr-11' : '',
            'text-[#E6E8F2] placeholder:text-[#5A659E]',
            'focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.5)]',
            'transition-all duration-200',
            error && 'border-red-400/50 focus:ring-red-400/50',
            className
          )}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E96BD]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
});
