import { cn } from '../../lib/utils';
import { Inbox, Search, WifiOff, AlertCircle, LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  variant?: 'default' | 'no-data' | 'no-results' | 'error' | 'offline';
  className?: string;
}

const VARIANT_ICONS: Record<string, LucideIcon> = {
  default: Inbox,
  'no-data': Inbox,
  'no-results': Search,
  error: AlertCircle,
  offline: WifiOff,
};

const VARIANT_COLORS: Record<string, string> = {
  default: 'text-muted',
  'no-data': 'text-cyan-400',
  'no-results': 'text-amber-400',
  error: 'text-red-400',
  offline: 'text-muted',
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  variant = 'no-data',
  className,
}: EmptyStateProps) {
  const Icon = icon ?? VARIANT_ICONS[variant];
  const color = VARIANT_COLORS[variant];

  const ActionButton = actionLabel ? (
    <Button
      variant="primary"
      onClick={actionHref ? () => window.location.assign(actionHref) : onAction}
    >
      {actionLabel}
    </Button>
  ) : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-12 min-h-[300px] animate-fade-in',
        className
      )}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl bg-tertiary border border-black flex items-center justify-center mb-4',
          'shadow-lg'
        )}
      >
        <Icon className={cn('w-8 h-8', color)} />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-md mb-6 leading-relaxed">{description}</p>
      )}
      {ActionButton}
    </div>
  );
}
