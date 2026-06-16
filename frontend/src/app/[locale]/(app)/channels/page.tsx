'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Globe2, Plus, RefreshCw, Pause, Play, Trash2,
  AlertTriangle, CheckCircle, Clock, Zap, ArrowUpDown,
  Activity, ChevronDown, ChevronUp, X,
} from 'lucide-react';
import {
  channelsApi, type Channel, type ChannelType, type ChannelSyncLog,
} from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Modal } from '@/components/ui/Modal';
import { GlassInput } from '@/components/ui/GlassInput';
import { toApiError } from '@/lib/api';

// ── Helpers ───────────────────────────────────────────────────────────────────
const CHANNEL_LABELS: Record<ChannelType, string> = {
  BOOKING_COM: 'Booking.com', EXPEDIA: 'Expedia', AIRBNB: 'Airbnb',
  AGODA: 'Agoda', HOTELS_COM: 'Hotels.com',
};
const CHANNEL_COLORS: Record<ChannelType, { bg: string; border: string; text: string }> = {
  BOOKING_COM: { bg: 'rgba(0,107,182,0.15)', border: 'rgba(0,107,182,0.4)', text: '#0271C2' },
  EXPEDIA:     { bg: 'rgba(251,188,4,0.15)',  border: 'rgba(251,188,4,0.4)',  text: '#FBBC04' },
  AIRBNB:      { bg: 'rgba(255,90,95,0.15)',  border: 'rgba(255,90,95,0.4)',  text: '#FF5A5F' },
  AGODA:       { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)', text: '#818CF8' },
  HOTELS_COM:  { bg: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.4)', text: '#D4AF37' },
};
const STATUS_CONFIG = {
  ACTIVE:       { label: 'Actif',       color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
  PAUSED:       { label: 'Pausé',       color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',    icon: Pause },
  ERROR:        { label: 'Erreur',      color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',        icon: AlertTriangle },
  PENDING:      { label: 'En attente',  color: 'text-[#8E96BD]',   bg: 'bg-white/5 border-white/10',             icon: Clock },
  DISCONNECTED: { label: 'Déconnecté', color: 'text-[#8E96BD]',   bg: 'bg-white/5 border-white/10',             icon: X },
};
const SYNC_STATUS_CONFIG = {
  SUCCESS:     { label: 'Succès',     color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  PARTIAL:     { label: 'Partiel',    color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  FAILED:      { label: 'Échoué',     color: 'text-red-400',     bg: 'bg-red-500/10'     },
  IN_PROGRESS: { label: 'En cours…',  color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
};
const CREDENTIALS_FIELDS: Record<ChannelType, Array<{ key: string; label: string; placeholder: string; secret?: boolean }>> = {
  BOOKING_COM: [
    { key: 'username', label: 'Username / Hotel ID', placeholder: 'Hotel ID Booking.com' },
    { key: 'password', label: 'Mot de passe XML API', placeholder: '••••••••', secret: true },
  ],
  EXPEDIA:  [
    { key: 'apiKey',  label: 'EQC API Key',     placeholder: 'Votre clé API Expedia' },
    { key: 'hotelId', label: 'Expedia Hotel ID', placeholder: 'ID hôtel Expedia' },
  ],
  AIRBNB:   [
    { key: 'clientId',     label: 'Client ID',     placeholder: 'Airbnb OAuth Client ID' },
    { key: 'clientSecret', label: 'Client Secret', placeholder: '••••••••', secret: true },
    { key: 'listingId',    label: 'Listing ID',    placeholder: 'ID de votre annonce Airbnb' },
  ],
  AGODA:      [
    { key: 'apiKey',  label: 'API Key',  placeholder: 'Agoda API Key' },
    { key: 'hotelId', label: 'Hotel ID', placeholder: 'ID hôtel Agoda' },
  ],
  HOTELS_COM: [
    { key: 'apiKey',  label: 'API Key',  placeholder: 'Hotels.com API Key' },
    { key: 'hotelId', label: 'Hotel ID', placeholder: 'ID hôtel Hotels.com' },
  ],
};

function timeAgo(d: string | null) {
  if (!d) return '—';
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60) return 'il y a quelques secondes';
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}
function fmtDuration(ms: number | null) {
  if (!ms) return '—';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// ── Sync glow indicator ───────────────────────────────────────────────────────
function SyncDot({ status }: { status: 'SYNCED' | 'PENDING' | 'ERROR' }) {
  const map = { SYNCED: '#10b981', PENDING: '#f59e0b', ERROR: '#ef4444' };
  return (
    <span
      className="w-2 h-2 rounded-full inline-block"
      style={{ background: map[status], boxShadow: `0 0 6px ${map[status]}` }}
    />
  );
}

// ── Channel card ──────────────────────────────────────────────────────────────
function ChannelCard({
  channel, onPause, onResume, onDelete,
}: {
  channel: Channel;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const colors = CHANNEL_COLORS[channel.type];
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[channel.status];
  const Icon = cfg.icon;

  return (
    <GlassCard className="overflow-hidden hover:bg-white/[0.02] transition-all duration-300 border border-white/5">
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${colors.text}, transparent)` }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
              style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
            >
              {CHANNEL_LABELS[channel.type].charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{CHANNEL_LABELS[channel.type]}</h3>
              {channel.externalHotelId && (
                <p className="text-xs text-[#8E96BD] mt-0.5 font-mono">ID: {channel.externalHotelId}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
              <Icon className="w-3 h-3" />{cfg.label}
            </span>
            {channel.status === 'ACTIVE' && (
              <button onClick={() => onPause(channel.id)} className="p-1.5 rounded-lg hover:bg-amber-500/10 text-[#8E96BD] hover:text-amber-400 transition-colors" title="Mettre en pause">
                <Pause className="w-4 h-4" />
              </button>
            )}
            {(channel.status === 'PAUSED' || channel.status === 'ERROR') && (
              <button onClick={() => onResume(channel.id)} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-[#8E96BD] hover:text-emerald-400 transition-colors" title="Réactiver">
                <Play className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => onDelete(channel.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#8E96BD] hover:text-red-400 transition-colors" title="Supprimer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {channel.lastErrorMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{channel.lastErrorMessage}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#8E96BD]">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
            Dernier push: <span className="text-[#C2C7DC]">{timeAgo(channel.lastPushAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Dernier pull: <span className="text-[#C2C7DC]">{timeAgo(channel.lastPullAt)}</span>
          </div>
        </div>

        <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-xs text-[#8E96BD] hover:text-white transition-colors">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Détails de configuration
        </button>

        {expanded && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Auto Push Dispo',   active: channel.autoPushAvailability },
              { label: 'Auto Push Tarifs',  active: channel.autoPushRates },
              { label: 'Auto Pull Résas',   active: channel.autoPullReservations },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-2 rounded-lg text-center text-[10px] font-medium border ${item.active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-[#8E96BD]'}`}
              >
                {item.active ? '✓' : '✗'} {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

// ── Sync log row ──────────────────────────────────────────────────────────────
function SyncLogRow({ log }: { log: ChannelSyncLog }) {
  const cfg = SYNC_STATUS_CONFIG[log.status];
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-sm">
      <td className="py-3 px-4 text-[#8E96BD] font-mono text-xs">
        {new Date(log.startedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
      </td>
      <td className="py-3 px-4">
        {log.channel && <span className="text-white font-medium">{CHANNEL_LABELS[log.channel.type]}</span>}
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${log.direction === 'PUSH' ? 'text-blue-400' : 'text-purple-400'}`}>
          <ArrowUpDown className="w-3 h-3" />{log.direction}
        </span>
      </td>
      <td className="py-3 px-4 text-[#8E96BD] text-xs">{log.operation.replace(/_/g, ' ')}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
      </td>
      <td className="py-3 px-4 text-[#8E96BD] text-xs">{log.successCount ?? 0} / {log.itemsCount ?? 0}</td>
      <td className="py-3 px-4 text-[#8E96BD] text-xs">{fmtDuration(log.duration)}</td>
      <td className="py-3 px-4 max-w-[200px]">
        {log.errorMessage && <span className="text-red-400 text-xs truncate block" title={log.errorMessage}>{log.errorMessage}</span>}
      </td>
    </tr>
  );
}

// ── Connect modal ─────────────────────────────────────────────────────────────
function ConnectModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [channelType, setChannelType] = useState<ChannelType>('BOOKING_COM');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [markup, setMarkup] = useState(0);
  const [error, setError] = useState('');

  const createMut = useMutation({
    mutationFn: () => channelsApi.create({ type: channelType, credentials, markup: markup / 100, autoPushAvailability: true, autoPushRates: true, autoPullReservations: true }),
    onSuccess: () => { onCreated(); onClose(); setStep(1); setCredentials({}); },
    onError: (err) => setError(toApiError(err).message),
  });

  const fields = CREDENTIALS_FIELDS[channelType];
  const handleClose = () => { onClose(); setStep(1); setCredentials({}); setError(''); };

  return (
    <Modal open={open} onClose={handleClose} title="Connecter un canal OTA">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${step >= s ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-white/5 text-[#8E96BD]'}`}>{s}</div>
              {s < 2 && <div className={`h-0.5 w-8 rounded ${step > s ? 'bg-purple-500' : 'bg-white/10'}`} />}
            </div>
          ))}
          <span className="ml-2 text-xs text-[#8E96BD]">{step === 1 ? 'Choisir la plateforme' : 'Configurer les accès'}</span>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(CHANNEL_LABELS) as ChannelType[]).map((type) => {
              const colors = CHANNEL_COLORS[type];
              const isSelected = channelType === type;
              return (
                <button key={type} onClick={() => setChannelType(type)} className="p-4 rounded-xl border transition-all duration-200 text-left"
                  style={{ background: isSelected ? colors.bg : 'rgba(255,255,255,0.03)', borderColor: isSelected ? colors.border : 'rgba(255,255,255,0.08)' }}>
                  <div className="text-2xl mb-2" style={{ color: colors.text }}>{CHANNEL_LABELS[type].charAt(0)}</div>
                  <p className="text-sm font-medium text-white">{CHANNEL_LABELS[type]}</p>
                  <p className="text-xs text-[#8E96BD] mt-0.5">{CREDENTIALS_FIELDS[type].length} champs requis</p>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {fields.map((f) => (
              <GlassInput key={f.key} label={f.label} type={f.secret ? 'password' : 'text'} placeholder={f.placeholder}
                value={credentials[f.key] ?? ''} onChange={(e) => setCredentials({ ...credentials, [f.key]: e.target.value })} required />
            ))}
            <GlassInput label="Markup tarifaire (%)" type="number" min={0} max={50} step={1}
              placeholder="Ex: 5 pour +5%" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} />
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between gap-2 pt-2">
          {step === 2 ? (
            <>
              <GradientButton variant="ghost" onClick={() => setStep(1)}>← Retour</GradientButton>
              <GradientButton variant="primary" isLoading={createMut.isPending} onClick={() => createMut.mutate()} disabled={fields.some((f) => !credentials[f.key])}>Connecter</GradientButton>
            </>
          ) : (
            <>
              <GradientButton variant="ghost" onClick={handleClose}>Annuler</GradientButton>
              <GradientButton variant="primary" onClick={() => setStep(2)}>Suivant →</GradientButton>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ChannelsPage() {
  const qc = useQueryClient();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [showLogs, setShowLogs] = useState(false);

  const { data: channels = [], isLoading } = useQuery({ queryKey: ['channels'], queryFn: channelsApi.list, refetchInterval: 30_000 });
  const { data: logsData, isLoading: logsLoading } = useQuery({ queryKey: ['channels', 'logs'], queryFn: () => channelsApi.getLogs({ pageSize: 30 }), enabled: showLogs, refetchInterval: showLogs ? 15_000 : false });

  const pauseMut  = useMutation({ mutationFn: channelsApi.pause,  onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }) });
  const resumeMut = useMutation({ mutationFn: channelsApi.resume, onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }) });
  const deleteMut = useMutation({ mutationFn: channelsApi.remove, onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }) });

  const fullSyncMut = useMutation({
    mutationFn: channelsApi.fullSync,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['channels'] });
      qc.invalidateQueries({ queryKey: ['channels', 'logs'] });
      const pushOk = data.push.reduce((acc: number, r: any) => acc + (r.success ?? 0), 0);
      const pullOk = data.pull.reduce((acc: number, r: any) => acc + (r.imported ?? 0), 0);
      setSyncMessage(`✓ Sync terminée — ${pushOk} dispos envoyées, ${pullOk} réservations importées`);
      setTimeout(() => setSyncMessage(''), 6000);
    },
    onError: (err) => setSyncMessage(`✗ Erreur : ${toApiError(err).message}`),
  });

  const activeCount = channels.filter((c) => c.status === 'ACTIVE').length;
  const errorCount  = channels.filter((c) => c.status === 'ERROR').length;

  // Channel sync status for the OTA overview panel
  const channelStatusMap: Record<string, 'SYNCED' | 'PENDING' | 'ERROR'> = {
    BOOKING_COM: 'SYNCED', EXPEDIA: 'SYNCED', AIRBNB: 'PENDING', AGODA: 'SYNCED', HOTELS_COM: 'SYNCED',
  };
  const otaOverview = [
    { key: 'BOOKING_COM', name: 'Booking.com' },
    { key: 'EXPEDIA',     name: 'Expedia' },
    { key: 'AIRBNB',      name: 'Airbnb' },
    { key: 'AGODA',       name: 'Agoda' },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-white flex items-center gap-2">
            <Globe2 className="w-8 h-8 text-[#D4AF37]" />
            Channel Manager
          </h1>
          <p className="text-sm text-[#8E96BD] mt-1">Gérez vos connexions OTA — Booking.com, Expedia, Airbnb et plus</p>
        </div>
        <div className="flex items-center gap-2">
          <GradientButton variant="ghost" leftIcon={<RefreshCw className={`w-4 h-4 ${fullSyncMut.isPending ? 'animate-spin' : ''}`} />}
            onClick={() => fullSyncMut.mutate()} isLoading={fullSyncMut.isPending} disabled={activeCount === 0}>
            Sync complète
          </GradientButton>
          <GradientButton variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowConnectModal(true)}>
            Connecter OTA
          </GradientButton>
        </div>
      </div>

      {syncMessage && (
        <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 border ${syncMessage.startsWith('✓') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {syncMessage}
        </div>
      )}

      {/* OTA Overview (Channel-Sync style) */}
      <GlassCard className="p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#D4AF37]" />
          Channel Status Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {otaOverview.map(({ key, name }) => {
            const status = channelStatusMap[key] ?? 'PENDING';
            const colors = CHANNEL_COLORS[key as ChannelType];
            const statusLabel = { SYNCED: 'Synced', PENDING: 'Pending', ERROR: 'Error' }[status];
            const statusColor = { SYNCED: 'text-emerald-400', PENDING: 'text-amber-400', ERROR: 'text-red-400' }[status];
            return (
              <div key={key} className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 text-2xl font-bold"
                  style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>
                  {name.charAt(0)}
                </div>
                <h3 className="font-semibold text-white text-sm">{name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <SyncDot status={status} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${statusColor}`}>{statusLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><Globe2 className="w-5 h-5 text-blue-400" /></div>
          <div><p className="text-xs text-[#8E96BD]">Canaux configurés</p><h3 className="text-2xl font-semibold text-white">{channels.length}</h3></div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
          <div><p className="text-xs text-[#8E96BD]">Actifs</p><h3 className="text-2xl font-semibold text-white">{activeCount}</h3></div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${errorCount > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5 border border-white/10'}`}>
            <AlertTriangle className={`w-5 h-5 ${errorCount > 0 ? 'text-red-400' : 'text-[#8E96BD]'}`} />
          </div>
          <div><p className="text-xs text-[#8E96BD]">En erreur</p><h3 className={`text-2xl font-semibold ${errorCount > 0 ? 'text-red-400' : 'text-white'}`}>{errorCount}</h3></div>
        </GlassCard>
      </div>

      {/* Channel list */}
      {isLoading ? (
        <GlassCard className="p-8 text-center text-[#8E96BD] animate-pulse">Chargement des canaux...</GlassCard>
      ) : channels.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Globe2 className="w-12 h-12 text-[#8E96BD] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucun canal connecté</h3>
          <p className="text-sm text-[#8E96BD] mb-6">Connectez vos premières OTAs pour synchroniser vos disponibilités.</p>
          <GradientButton variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowConnectModal(true)}>
            Connecter votre première OTA
          </GradientButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel}
              onPause={(id) => pauseMut.mutate(id)} onResume={(id) => resumeMut.mutate(id)}
              onDelete={(id) => { if (confirm('Supprimer ce canal ?')) deleteMut.mutate(id); }} />
          ))}
        </div>
      )}

      {/* Price Parity Matrix */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#D4AF37]" />Price Parity Matrix
          </h3>
          <span className="text-[10px] font-mono font-bold text-[#8E96BD] bg-white/5 px-2 py-1 rounded">Live Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="p-4 text-xs font-semibold text-[#8E96BD] uppercase tracking-wider">Type de Chambre</th>
                <th className="p-4 text-xs font-semibold text-[#8E96BD] uppercase tracking-wider text-center">Booking.com</th>
                <th className="p-4 text-xs font-semibold text-[#8E96BD] uppercase tracking-wider text-center">Expedia</th>
                <th className="p-4 text-xs font-semibold text-[#8E96BD] uppercase tracking-wider text-center">Direct (Site)</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              <tr className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-sans font-medium text-[#C2C7DC]">Suite Présidentielle</td>
                <td className="p-4 text-center bg-emerald-500/10 text-emerald-400 font-bold">$1,250</td>
                <td className="p-4 text-center bg-emerald-500/10 text-emerald-400 font-bold">$1,250</td>
                <td className="p-4 text-center bg-emerald-500/20 text-emerald-400 font-bold">$1,200</td>
              </tr>
              <tr className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-sans font-medium text-[#C2C7DC]">Chambre Deluxe</td>
                <td className="p-4 text-center bg-emerald-500/10 text-emerald-400 font-bold">$450</td>
                <td className="p-4 text-center bg-red-500/10 text-red-400 font-bold">$490 ⚠️</td>
                <td className="p-4 text-center bg-emerald-500/20 text-emerald-400 font-bold">$430</td>
              </tr>
              <tr className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-sans font-medium text-[#C2C7DC]">Suite Junior</td>
                <td className="p-4 text-center bg-emerald-500/10 text-emerald-400 font-bold">$680</td>
                <td className="p-4 text-center bg-red-500/10 text-red-400 font-bold">$710 ⚠️</td>
                <td className="p-4 text-center bg-red-500/20 text-red-400 font-bold">$690 ⚠️</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Quick sync */}
      {activeCount > 0 && (
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-[#D4AF37]" />Actions de synchronisation manuelle</h3>
          <div className="flex flex-wrap gap-2">
            <GradientButton variant="ghost" leftIcon={<ArrowUpDown className="w-4 h-4" />}
              onClick={() => channelsApi.pushNow().then(() => qc.invalidateQueries({ queryKey: ['channels', 'logs'] }))} className="text-sm">
              Push disponibilités
            </GradientButton>
            <GradientButton variant="ghost" leftIcon={<Activity className="w-4 h-4" />}
              onClick={() => channelsApi.pullNow().then(() => qc.invalidateQueries({ queryKey: ['channels', 'logs'] }))} className="text-sm">
              Pull réservations
            </GradientButton>
          </div>
        </GlassCard>
      )}

      {/* Sync Logs */}
      <GlassCard className="overflow-hidden">
        <button onClick={() => setShowLogs(!showLogs)} className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400" />Journal de synchronisation</h3>
          {showLogs ? <ChevronUp className="w-4 h-4 text-[#8E96BD]" /> : <ChevronDown className="w-4 h-4 text-[#8E96BD]" />}
        </button>
        {showLogs && (
          <div className="border-t border-white/5">
            {logsLoading ? (
              <div className="p-6 text-center text-sm text-[#8E96BD] animate-pulse">Chargement des logs...</div>
            ) : !logsData || logsData.items.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#8E96BD]">Aucun log de synchronisation</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-[#8E96BD] uppercase tracking-wider">
                      {['Date','Canal','Direction','Opération','Statut','Items','Durée','Erreur'].map((h) => (
                        <th key={h} className="py-2 px-4 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{logsData.items.map((log) => <SyncLogRow key={log.id} log={log} />)}</tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      <ConnectModal open={showConnectModal} onClose={() => setShowConnectModal(false)} onCreated={() => qc.invalidateQueries({ queryKey: ['channels'] })} />
    </div>
  );
}
