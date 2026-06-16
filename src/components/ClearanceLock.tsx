import { useState } from 'react';
import { Lock, Shield, ChevronRight, Fingerprint, AlertOctagon } from 'lucide-react';
import type { CurrentUser } from '../lib/rbac';
import { getTabRestriction } from '../lib/rbac';
import { useElevationControl } from '../hooks/useElevationControl';

interface ClearanceLockProps {
  tabId: string;
  currentUser: CurrentUser;
  onElevate: () => void;
}

export function ClearanceLock({ tabId, currentUser, onElevate }: ClearanceLockProps) {
  const restriction = getTabRestriction(tabId);
  const [confirming, setConfirming] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { config, isElevationAllowed } = useElevationControl();

  if (!restriction) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-slate-500">Unknown restricted area.</p>
      </div>
    );
  }

  const canElevate = isElevationAllowed();

  const handleElevate = () => {
    if (!canElevate) return;
    if (cooldown > 0) return;

    if (confirming) {
      onElevate();
      setConfirming(false);
    } else {
      setConfirming(true);
      if (config.cooldownSeconds > 0) {
        setCooldown(config.cooldownSeconds);
        const interval = setInterval(() => {
          setCooldown((c) => {
            if (c <= 1) {
              clearInterval(interval);
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      } else {
        setTimeout(() => setConfirming(false), 4000);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl w-full">
        <div className="relative">
          {/* Scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5 rounded-2xl"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            }}
          />

          <div className="relative bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-10 shadow-2xl shadow-amber-500/10">
            {/* Lock icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30 animate-pulse">
                  <Lock className="w-12 h-12 text-slate-900 dark:text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                  <span className="text-slate-900 dark:text-white text-[9px] font-black">!</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 mb-3">
                <Shield className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                  Clearance {restriction.securityLevel} Required
                </span>
              </div>
              <h2 className="text-3xl font-serif font-black text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-tight">
                {restriction.label}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Requires <span className="font-bold text-amber-600 dark:text-amber-400">{restriction.requiredClearance}</span> clearance.
              </p>
            </div>

            {/* Production elevation disabled banner */}
            {!canElevate && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 mb-4">
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-rose-300">Elevation Disabled</p>
                  <p className="text-xs text-rose-400 mt-1">
                    Role elevation is not available in the <strong>{config.environment}</strong> environment.
                    Contact your system administrator to request elevated access.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-5">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {restriction.description}
              </p>
            </div>

            {/* User info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl mb-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Authenticated as</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                <p className="text-xs text-slate-500 font-mono">{currentUser.clearance}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Required</p>
                <p className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">{restriction.requiredClearance}</p>
              </div>
            </div>

            {/* Elevate button */}
            <button
              onClick={handleElevate}
              disabled={!canElevate || cooldown > 0}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all cursor-pointer uppercase tracking-wider ${
                !canElevate
                  ? 'bg-slate-100 dark:bg-slate-900/60 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                  : confirming
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-[1.01]'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.01]'
              }`}
            >
              <Fingerprint className="w-5 h-5" />
              <span>
                {!canElevate
                  ? 'Elevation Unavailable'
                  : cooldown > 0
                  ? `Wait ${cooldown}s...`
                  : confirming
                  ? `Confirm — Elevate to Lead Proprietor`
                  : 'Shift to Lead Proprietor'}
              </span>
              {canElevate && <ChevronRight className="w-4 h-4" />}
            </button>

            <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 mt-4 font-mono">
              Audit entry will be recorded • {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
