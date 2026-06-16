import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options, label, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-mono uppercase tracking-widest text-muted">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          'px-3 py-2 rounded-lg text-sm font-medium',
          'bg-[var(--bg-tertiary,#0F1424)] border border-black text-primary',
          'focus:outline-none focus:border-[#00D4FF]',
          'transition-colors duration-150',
          'appearance-none cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});
