import { clsx } from 'clsx';
import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';

type Option = { value: string; label: string };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Option[];
  error?: string;
  children?: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, options, error, className, id, ...rest },
  ref
) {
  const selectId = id ?? `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-midnight-100 mb-1.5" style={{ color: '#C2C7DC' }}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl',
          'glass focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.5)]',
          'transition-all duration-200 appearance-none cursor-pointer',
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23D4AF37%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E")] bg-no-repeat pr-10',
          error && 'border-red-400/50',
          className
        )}
        style={{ backgroundPosition: 'right 1rem center', color: '#E6E8F2' }}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: '#0A0E27' }}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
});
