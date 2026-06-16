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
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm',
          'bg-white/80 border border-gray-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400',
          'transition-all duration-200 appearance-none cursor-pointer',
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236B7280%27 stroke-width=%222%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E")] bg-no-repeat pr-10',
          error && 'border-red-400',
          className
        )}
        style={{ backgroundPosition: 'right 1rem center' }}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
});
