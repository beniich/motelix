import { AlertCircle, AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: unknown;
  onRetry?: () => void;
  variant?: 'error' | 'warning' | 'not-found' | 'forbidden';
}

export function ErrorState({
  title,
  message,
  error,
  onRetry,
  variant = 'error',
}: ErrorStateProps) {
  const config = {
    error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', defaultTitle: 'Une erreur est survenue' },
    warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', defaultTitle: 'Attention' },
    'not-found': { icon: AlertCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', defaultTitle: 'Page introuvable' },
    forbidden: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', defaultTitle: 'Accès refusé' },
  }[variant];

  const Icon = config.icon;
  const displayMessage =
    message ??
    (error instanceof Error ? error.message : null) ??
    "Une erreur inattendue s'est produite.";

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div
          className={`w-16 h-16 rounded-2xl ${config.bg} border ${config.border} flex items-center justify-center mx-auto mb-4`}
        >
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>
        <h2 className="text-2xl font-semibold text-primary mb-2">
          {title ?? config.defaultTitle}
        </h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">{displayMessage}</p>
        <div className="flex items-center justify-center gap-2">
          {onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Réessayer
            </Button>
          )}
          <Button variant="secondary" onClick={() => window.location.assign('/')}>
            <Home className="w-4 h-4 mr-1.5" />
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
