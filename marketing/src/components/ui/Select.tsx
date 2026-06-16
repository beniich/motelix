import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-midnight-200 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-midnight-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-midnight-50 appearance-none focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-all',
              error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
              className
            )}
            {...props}
          >
            <option value="" disabled hidden>Sélectionner...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-midnight-900 text-midnight-50">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-midnight-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="text-sm text-red-400 ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
