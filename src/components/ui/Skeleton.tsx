import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  lines?: number;
  width?: string;
  height?: string;
}

export function Skeleton({ className, variant = 'text', lines = 1, width, height }: SkeletonProps) {
  const baseClass = 'animate-pulse bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02]';

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('h-3 rounded', baseClass, className)}
            style={{ width: i === lines - 1 ? width ?? '75%' : width ?? '100%', height }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={cn('rounded-full', baseClass, className)}
        style={{ width: width ?? '40px', height: height ?? '40px' }}
      />
    );
  }

  return (
    <div
      className={cn('rounded-lg', baseClass, className)}
      style={{ width: width ?? '100%', height: height ?? '100px' }}
    />
  );
}

export function SkeletonCard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-secondary border border-black">
      {children ?? (
        <div className="space-y-3">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" lines={2} />
        </div>
      )}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* header row */}
      <div className="flex gap-4 pb-2 border-b border-black">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} variant="text" width={`${100 / cols}%`} className="h-4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-1">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} variant="text" width={`${100 / cols}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-secondary border border-black space-y-3">
          <Skeleton variant="text" width="50%" className="h-3" />
          <Skeleton variant="text" width="70%" className="h-8" />
          <Skeleton variant="text" width="40%" className="h-3" />
        </div>
      ))}
    </div>
  );
}
