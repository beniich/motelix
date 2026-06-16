'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { flushQueue, getQueue } from '@/lib/offline-queue';
import { toast } from 'sonner';

export function OfflineBanner() {
  const online = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);

  // Refresh pending count every 5s when offline
  useEffect(() => {
    const refresh = async () => {
      const queue = await getQueue();
      setPendingCount(queue.length);
    };
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-flush on network regain
  useEffect(() => {
    if (online && pendingCount > 0) {
      setJustCameOnline(true);
      setSyncing(true);
      flushQueue()
        .then(({ succeeded, failed }) => {
          if (succeeded > 0) {
            toast.success(`${succeeded} action(s) synchronisée(s) avec succès`);
          }
          if (failed > 0) {
            toast.error(`${failed} action(s) ont échoué lors de la sync`);
          }
          setPendingCount(0);
        })
        .catch(() => toast.error('Erreur lors de la synchronisation'))
        .finally(() => {
          setSyncing(false);
          setTimeout(() => setJustCameOnline(false), 3000);
        });
    }
  }, [online]);

  // Don't show anything if online and no pending ops
  if (online && !justCameOnline) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 ${
        online
          ? 'bg-emerald-900/80 border-emerald-500/40 text-emerald-200'
          : 'bg-slate-900/90 border-amber-500/40 text-amber-200'
      }`}
      style={{ minWidth: 280 }}
    >
      {online ? (
        <>
          {syncing ? (
            <RefreshCw size={18} className="animate-spin text-emerald-400" />
          ) : (
            <CheckCircle size={18} className="text-emerald-400" />
          )}
          <span className="text-sm font-medium">
            {syncing ? 'Synchronisation en cours…' : 'Connexion rétablie — tout est à jour'}
          </span>
        </>
      ) : (
        <>
          <WifiOff size={18} className="text-amber-400 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Mode hors-ligne</p>
            {pendingCount > 0 && (
              <p className="text-xs text-amber-300/80">
                {pendingCount} action{pendingCount > 1 ? 's' : ''} en attente de sync
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
