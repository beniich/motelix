import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const GlassInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-midnight-200 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-midnight-300">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-midnight-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-midnight-50 placeholder-midnight-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-all',
              leftIcon && 'pl-10',
              error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-400 ml-1">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
