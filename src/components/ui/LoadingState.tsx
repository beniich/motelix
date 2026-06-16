import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingStateProps {
  label?: string;
  variant?: 'spinner' | 'pulse' | 'shimmer';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function LoadingState({
  label = 'Chargement…',
  variant = 'spinner',
  size = 'md',
  className,
}: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center gap-3', className)}>
        <Loader2 className={cn(SIZES[size], 'text-cyan-400 animate-spin')} />
        {label && <span className="text-sm text-muted">{label}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center gap-2', className)}>
        <Sparkles className={cn(SIZES[size], 'text-amber-400 animate-pulse')} />
        {label && <span className="text-sm text-muted">{label}</span>}
      </div>
    );
  }

  // shimmer
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-40 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-gradient-electric" />
      </div>
      {label && <span className="ml-4 text-sm text-muted">{label}</span>}
    </div>
  );
}

export function PageLoading({ label }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingState label={label} size="lg" />
    </div>
  );
}
