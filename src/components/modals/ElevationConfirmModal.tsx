import { useState, useEffect } from 'react';
import { Fingerprint, X, AlertCircle } from 'lucide-react';
import type { CurrentUser } from '../../lib/rbac';

interface ElevationConfirmModalProps {
  open: boolean;
  currentUser: CurrentUser;
  cooldownSeconds?: number;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function ElevationConfirmModal({
  open,
  currentUser,
  cooldownSeconds = 5,
  onConfirm,
  onCancel,
}: ElevationConfirmModalProps) {
  const [reasonText, setReasonText] = useState('');
  const [countdown, setCountdown] = useState(cooldownSeconds);
  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    if (!open) {
      setReasonText('');
      setCountdown(cooldownSeconds);
      setCanConfirm(false);
      return;
    }

    setCountdown(cooldownSeconds);
    setCanConfirm(false);

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setCanConfirm(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, cooldownSeconds]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-amber-500/20"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Fingerprint className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Confirm Role Elevation
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Verify your intent before proceeding
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Warning banner */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              You are about to elevate{' '}
              <strong>{currentUser.name}</strong> from{' '}
              <strong>LEVEL-4-ARRIVAL</strong> to{' '}
              <strong>LEVEL-5-PROPRIETOR</strong>.
              This action grants access to all restricted command center areas.
            </p>
          </div>
        </div>

        {/* Reason textarea */}
        <div className="mb-5">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Reason (required — logged in audit trail)
          </label>
          <textarea
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="e.g., Testing Master Switch functionality"
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-mono transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reasonText)}
            disabled={!canConfirm || !reasonText.trim()}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              canConfirm && reasonText.trim()
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 cursor-pointer'
                : 'bg-slate-100 dark:bg-slate-900/60 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-800'
            }`}
          >
            {countdown > 0 ? `Confirm in ${countdown}s` : 'Confirm Elevation'}
          </button>
        </div>
      </div>
    </div>
  );
}
