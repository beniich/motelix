import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Globe, Plus, RefreshCw, Pause, Play, Trash2, Send, Download, 
  AlertCircle, Loader2, ExternalLink, Settings 
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { GlassCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  useChannels, useAvailableChannelTypes, useCreateChannel, 
  usePauseChannel, useResumeChannel, useDeleteChannel, 
  usePushChannel, usePullChannel, useSyncAllChannels, 
  useChannelSyncLogs, CHANNEL_META, type Channel, type SyncLog 
} from '@/hooks/useChannels';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; variant: any; color: string }> = {
  ACTIVE:       { label: 'Actif',        variant: 'success', color: 'text-emerald-400' },
  PAUSED:       { label: 'En pause',     variant: 'warning',  color: 'text-amber-400' },
  ERROR:        { label: 'Erreur',       variant: 'danger',   color: 'text-red-400' },
  DISCONNECTED: { label: 'Déconnecté',   variant: 'danger',   color: 'text-red-400' },
  PENDING:      { label: 'En attente',   variant: 'default',  color: 'text-muted' },
};

export function ChannelManagerDashboard() {
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  
  const { data: channels, isLoading } = useChannels();
  const { data: types } = useAvailableChannelTypes();
  const pauseMut = usePauseChannel();
  const resumeMut = useResumeChannel();
  const deleteMut = useDeleteChannel();
  const pushMut = usePushChannel();
  const pullMut = usePullChannel();
  const syncAllMut = useSyncAllChannels();
  
  const isMock = types?.some((t: any) => t.isMock) ?? false;
  const connected = channels?.filter(c => c.status === 'ACTIVE').length ?? 0;
  const total = channels?.length ?? 0;
  
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-2">
            <Globe className="w-7 h-7 text-cyan-400" />
            Channel Manager
          </h1>
          <p className="text-sm text-muted mt-1">
            {connected} actif{connected > 1 ? 's' : ''} sur {total} configuré{total > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => 
              syncAllMut.mutate(undefined, {
                onSuccess: (res) => {
                  const total = res?.push?.reduce((s: number, r: any) => s + (r.success || 0), 0) ?? 0;
                  toast.show({ 
                    type: 'success', 
                    title: 'Sync terminée', 
                    message: `${total} mises à jour poussées` 
                  });
                },
                onError: () => toast.show({ type: 'error', title: 'Erreur sync' }),
              })
            }
            isLoading={syncAllMut.isPending}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tout synchroniser
          </Button>
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Connecter
          </Button>
        </div>
      </div>
      
      {isMock && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Mode MOCK</strong> : les connecteurs ne contactent pas de vraies OTA. 
            Configurez les credentials via les variables d'environnement en production.
          </span>
        </div>
      )}
      
      {channels && channels.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setLogsOpen(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <Settings className="w-3 h-3" /> Voir les logs de sync
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels?.length === 0 ? (
          <GlassCard className="col-span-full text-center py-12">
            <Globe className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">Aucun canal connecté</p>
            <p className="text-xs text-muted mt-1">
              Commencez par Booking.com, votre canal principal.
            </p>
          </GlassCard>
        ) : (
          channels?.map((c) => <ChannelCard key={c.id} channel={c} onAction={handleChannelAction} />)
        )}
      </div>
      
      {createOpen && (
        <CreateChannelModal 
          onClose={() => setCreateOpen(false)} 
          existingTypes={channels?.map(c => c.type) ?? []} 
        />
      )}
      
      {logsOpen && (
        <SyncLogsModal onClose={() => setLogsOpen(false)} />
      )}
    </div>
  );
  
  function handleChannelAction(c: Channel, action: 'pause' | 'resume' | 'push' | 'pull' | 'delete') {
    switch (action) {
      case 'pause':
        pauseMut.mutate(c.id, { 
          onSuccess: () => toast.show({ type: 'success', title: 'Canal en pause' }),
          onError: () => toast.show({ type: 'error', title: 'Erreur' }),
        });
        break;
      case 'resume':
        resumeMut.mutate(c.id, { 
          onSuccess: () => toast.show({ type: 'success', title: 'Canal réactivé' }),
          onError: () => toast.show({ type: 'error', title: 'Erreur' }),
        });
        break;
      case 'push':
        pushMut.mutate(c.id, { 
          onSuccess: () => toast.show({ type: 'success', title: 'Push envoyé' }),
          onError: () => toast.show({ type: 'error', title: 'Erreur push' }),
        });
        break;
      case 'pull':
        pullMut.mutate(c.id, { 
          onSuccess: () => toast.show({ type: 'success', title: 'Pull terminé' }),
          onError: () => toast.show({ type: 'error', title: 'Erreur pull' }),
        });
        break;
      case 'delete':
        if (confirm(`Supprimer le canal ${CHANNEL_META[c.type]?.name} ?`)) {
          deleteMut.mutate(c.id, { 
            onSuccess: () => toast.show({ type: 'success', title: 'Canal supprimé' }),
            onError: () => toast.show({ type: 'error', title: 'Erreur suppression' }),
          });
        }
        break;
    }
  }
}

function ChannelCard({ 
  channel: c, 
  onAction 
}: { 
  channel: Channel; 
  onAction: (c: Channel, action: 'pause' | 'resume' | 'push' | 'pull' | 'delete') => void 
}) {
  const meta = CHANNEL_META[c.type] ?? { name: c.type, color: 'bg-gray-500', docsUrl: '' };
  const status = STATUS_CONFIG[c.status];
  
  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm',
            meta.color
          )}>
            {meta.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">{meta.name}</p>
            <p className="text-[10px] font-mono text-muted">
              {c.externalHotelId ?? 'Non configuré'}
            </p>
          </div>
        </div>
        <span className={cn('text-xs font-medium', status?.color)}>
          {status?.label}
        </span>
      </div>
      
      {c.lastErrorMessage && (
        <div className="mb-3 p-2 rounded bg-red-500/10 border border-red-500/30 text-[10px] text-red-300">
          ⚠ {c.lastErrorMessage}
        </div>
      )}
      
      <div className="space-y-1 text-[10px] text-muted mb-3">
        <div className="flex justify-between">
          <span>Dernier push</span>
          <span>
            {c.lastPushAt 
              ? formatDistanceToNow(parseISO(c.lastPushAt), { locale: frLocale, addSuffix: true }) 
              : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Dernier pull</span>
          <span>
            {c.lastPullAt 
              ? formatDistanceToNow(parseISO(c.lastPullAt), { locale: frLocale, addSuffix: true }) 
              : '—'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {c.autoPushAvailability && (
          <Badge variant="info" className="text-[10px]">↑ Dispos</Badge>
        )}
        {c.autoPushRates && (
          <Badge variant="info" className="text-[10px]">↑ Prix</Badge>
        )}
        {c.autoPullReservations && (
          <Badge variant="gold" className="text-[10px]">↓ Résas</Badge>
        )}
      </div>
      
      <div className="flex gap-1">
        {c.status === 'ACTIVE' ? (
          <button
            onClick={() => onAction(c, 'pause')}
            className="flex-1 p-1.5 rounded bg-tertiary border border-black text-xs text-muted hover:bg-white/5 flex items-center justify-center gap-1"
          >
            <Pause className="w-3 h-3" /> Pause
          </button>
        ) : (
          <button
            onClick={() => onAction(c, 'resume')}
            className="flex-1 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-500/20 flex items-center justify-center gap-1"
          >
            <Play className="w-3 h-3" /> Activer
          </button>
        )}
        <button
          onClick={() => onAction(c, 'push')}
          className="p-1.5 rounded bg-tertiary border border-black text-muted hover:bg-white/5"
          title="Push"
        >
          <Send className="w-3 h-3" />
        </button>
        <button
          onClick={() => onAction(c, 'pull')}
          className="p-1.5 rounded bg-tertiary border border-black text-muted hover:bg-white/5"
          title="Pull"
        >
          <Download className="w-3 h-3" />
        </button>
        <button
          onClick={() => onAction(c, 'delete')}
          className="p-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20"
          title="Supprimer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </GlassCard>
  );
}

function CreateChannelModal({ 
  onClose, 
  existingTypes 
}: { 
  onClose: () => void; 
  existingTypes: string[] 
}) {
  const toast = useToast();
  const [type, setType] = useState('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [markup, setMarkup] = useState(5);
  const { data: types } = useAvailableChannelTypes();
  const createMut = useCreateChannel();
  
  const available = (types ?? [])
    .filter(t => !existingTypes.includes(t.type) && t.type !== 'DIRECT' && t.type !== 'CUSTOM_OTA')
    .map(t => t.type);
  
  const isAirbnb = type === 'AIRBNB';
  
  return (
    <Modal open={true} onClose={onClose} title="Connecter un canal" size="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMut.mutate(
            { type, credentials, markup: markup / 100 },
            {
              onSuccess: () => {
                toast.show({ type: 'success', title: 'Canal connecté' });
                onClose();
              },
              onError: (err: any) => 
                toast.show({ 
                  type: 'error', 
                  title: 'Erreur', 
                  message: err?.response?.data?.error ?? 'Connexion échouée' 
                }),
            }
          );
        }}
        className="space-y-3"
      >
        <div>
          <label className="block text-xs font-mono uppercase text-muted mb-1">Canal</label>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setCredentials({}); }}
            required
            className="w-full px-3 py-2 rounded-lg bg-tertiary border border-black text-primary focus:outline-none focus:border-[#00D4FF]"
          >
            <option value="">Sélectionner…</option>
            {available.map(t => (
              <option key={t} value={t}>
                {CHANNEL_META[t]?.name ?? t}
              </option>
            ))}
          </select>
        </div>
        
        {isAirbnb && (
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">API Key</label>
            <input
              type="text"
              value={credentials.apiKey || ''}
              onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
              required
              placeholder="Votre clé API Channel Partner"
              className="w-full px-3 py-2 rounded-lg bg-tertiary border border-black text-primary focus:outline-none focus:border-[#00D4FF]"
            />
          </div>
        )}
        
        {!isAirbnb && type && (
          <>
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1">Username</label>
              <input
                type="text"
                value={credentials.username || ''}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg bg-tertiary border border-black text-primary focus:outline-none focus:border-[#00D4FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-muted mb-1">Password</label>
              <input
                type="password"
                value={credentials.password || ''}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg bg-tertiary border border-black text-primary focus:outline-none focus:border-[#00D4FF]"
              />
            </div>
            {CHANNEL_META[type]?.docsUrl && (
              <a
                href={CHANNEL_META[type].docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> Où trouver mes credentials ?
              </a>
            )}
          </>
        )}
        
        {type && (
          <div>
            <label className="block text-xs font-mono uppercase text-muted mb-1">
              Markup prix ({markup}%)
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={markup}
              onChange={(e) => setMarkup(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[10px] text-muted mt-1">
              Pourcentage ajouté pour couvrir la commission OTA ({markup}%).
            </p>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createMut.isPending}
            disabled={!type}
            className="flex-1"
          >
            Connecter
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function SyncLogsModal({ onClose }: { onClose: () => void }) {
  const { data: logs, isLoading } = useChannelSyncLogs();
  
  return (
    <Modal open={true} onClose={onClose} title="Historique des synchronisations" size="lg">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      ) : !logs || logs.length === 0 ? (
        <p className="text-center text-muted text-sm py-8">Aucun log de synchronisation</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted border-b border-black">
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Canal</th>
                <th className="py-2 px-2">Direction</th>
                <th className="py-2 px-2">Opération</th>
                <th className="py-2 px-2 text-right">Items</th>
                <th className="py-2 px-2 text-right">Succès</th>
                <th className="py-2 px-2 text-right">Échecs</th>
                <th className="py-2 px-2 text-right">Durée</th>
                <th className="py-2 px-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-black/30">
                  <td className="py-2 px-2 text-muted text-xs">
                    {formatDistanceToNow(parseISO(log.startedAt), { locale: frLocale, addSuffix: true })}
                  </td>
                  <td className="py-2 px-2 text-primary text-xs">
                    {CHANNEL_META[log.channel.type]?.name ?? log.channel.type}
                  </td>
                  <td className="py-2 px-2 text-muted">
                    {log.direction === 'PUSH' ? '↑' : '↓'}
                  </td>
                  <td className="py-2 px-2 text-secondary text-[10px]">{log.operation}</td>
                  <td className="py-2 px-2 text-right text-muted">{log.itemsCount}</td>
                  <td className="py-2 px-2 text-right text-emerald-400">{log.successCount}</td>
                  <td className="py-2 px-2 text-right text-red-400">{log.failedCount}</td>
                  <td className="py-2 px-2 text-right text-muted text-[10px]">
                    {log.duration ? `${log.duration}ms` : '—'}
                  </td>
                  <td className="py-2 px-2">
                    <Badge
                      variant={
                        log.status === 'SUCCESS' ? 'success' :
                        log.status === 'FAILED' ? 'danger' :
                        'warning'
                      }
                    >
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
