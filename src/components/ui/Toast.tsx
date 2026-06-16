import { useToast } from '@/hooks/useToast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  error: 'border-red-500/30 bg-red-500/10 text-red-300',
  info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto min-w-[300px] max-w-md p-4 rounded-xl border backdrop-blur-xl',
              'flex items-start gap-3 glow-blue-subtle',
              COLORS[toast.type]
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.message && <p className="text-xs mt-0.5 opacity-80">{toast.message}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="p-1 rounded hover:bg-white/10 flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
