'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  ChevronLeft,
  Camera,
  Check,
  X,
  Clock,
  Sparkles,
  ClipboardCheck,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { housekeepingApi } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlassInput } from '@/components/ui/GlassInput';
import {
  HousekeepingStatusBadge,
  HousekeepingTypeBadge
} from '@/components/ui/StatusBadge';
import { toApiError } from '@/lib/api';

export default function HousekeepingDetailPage() {
  const { id } = useParams() as { id: string };
  const t = useTranslations();
  const { user } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();

  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // Fetch task detail
  const { data: task, isLoading } = useQuery({
    queryKey: ['housekeeping-task', id],
    queryFn: () => housekeepingApi.get(id),
  });

  // Checklist state (key-value booleans)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [staffNotes, setStaffNotes] = useState('');
  const [issueReported, setIssueReported] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  // Inspector state
  const [inspectorNotes, setInspectorNotes] = useState('');

  // Initializing state when task loads
  useEffect(() => {
    if (task) {
      if (task.checklist) {
        try {
          setChecklist(JSON.parse(task.checklist));
        } catch {
          setChecklist({});
        }
      }
      setStaffNotes(task.staffNotes || '');
      setIssueReported(task.issueReported || false);
      setIssueDescription(task.issueDescription || '');
    }
  }, [task]);

  const startMut = useMutation({
    mutationFn: () => housekeepingApi.start(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['housekeeping-task', id] });
      qc.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
      qc.invalidateQueries({ queryKey: ['housekeeping', 'stats'] });
    },
  });

  const completeMut = useMutation({
    mutationFn: (payload: { checklist: Record<string, boolean>; notes?: string; issueReported?: boolean; issueDescription?: string }) =>
      housekeepingApi.complete(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['housekeeping-task', id] });
      qc.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
      qc.invalidateQueries({ queryKey: ['housekeeping', 'stats'] });
    },
  });

  const inspectMut = useMutation({
    mutationFn: (payload: { approved: boolean; notes?: string }) =>
      housekeepingApi.inspect(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['housekeeping-task', id] });
      qc.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
      qc.invalidateQueries({ queryKey: ['housekeeping', 'stats'] });
    },
  });

  const uploadPhotoMut = useMutation({
    mutationFn: (file: File) => housekeepingApi.uploadPhoto(id, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['housekeeping-task', id] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-[#8E96BD]">
        {t('common.appName')}... {t('common.loading')}
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-[#8E96BD]">
        Tâche introuvable
      </div>
    );
  }

  const handleCheckboxChange = (key: string) => {
    if (task.status !== 'IN_PROGRESS') return;
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStart = () => {
    startMut.mutate(undefined, {
      onError: (err) => alert(toApiError(err).message),
    });
  };

  const handleComplete = () => {
    // Check if everything is checked (unless issue is reported)
    const allChecked = Object.values(checklist).every(Boolean);
    if (!allChecked && !issueReported) {
      alert("Veuillez cocher tous les éléments de la checklist avant de terminer la tâche.");
      return;
    }

    completeMut.mutate(
      {
        checklist,
        notes: staffNotes,
        issueReported,
        issueDescription: issueReported ? issueDescription : undefined,
      },
      {
        onError: (err) => alert(toApiError(err).message),
      }
    );
  };

  const handleInspect = (approved: boolean) => {
    inspectMut.mutate(
      {
        approved,
        notes: inspectorNotes,
      },
      {
        onSuccess: () => {
          router.push('/housekeeping');
        },
        onError: (err) => alert(toApiError(err).message),
      }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhotoMut.mutate(file, {
        onError: (err) => alert(toApiError(err).message),
      });
    }
  };

  const checklistKeys = Object.keys(checklist);

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-4 mb-10">
      {/* Back button */}
      <Link href="/housekeeping" className="inline-flex items-center gap-1.5 text-sm text-[#8E96BD] hover:text-white transition-colors duration-200">
        <ChevronLeft className="w-4 h-4" />
        Retour à la liste
      </Link>

      {/* Task info card */}
      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-display font-semibold text-white">
                Chambre {task.room.number}
              </h1>
              <HousekeepingStatusBadge status={task.status} />
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-[#8E96BD]">
              <HousekeepingTypeBadge type={task.type} />
              <span>•</span>
              <span>Priorité {task.priority}</span>
              <span>•</span>
              <span>Étage {task.room.floor} ({task.room.type})</span>
            </div>
          </div>
        </div>

        {task.dueAt && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-[#8E96BD] bg-white/5 p-2.5 rounded-lg border border-white/5">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span>
              À faire avant le : <strong className="text-[#E6E8F2]">{new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> ({new Date(task.dueAt).toLocaleDateString()})
            </span>
          </div>
        )}

        {task.reservation && (
          <div className="mt-3 text-xs text-[#C2C7DC]">
            <strong>Réservation :</strong> Ref {task.reservation.reference}
            {task.reservation.guest && ` — ${task.reservation.guest.firstName} ${task.reservation.guest.lastName}`}
          </div>
        )}
      </GlassCard>

      {/* Checklist section */}
      {checklistKeys.length > 0 && (
        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2.5 mb-4">
            <ClipboardCheck className="w-5 h-5 text-[#D4AF37]" />
            Checklist de nettoyage
          </h2>

          <div className="space-y-3">
            {checklistKeys.map((key) => (
              <label
                key={key}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  checklist[key]
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                    : 'bg-white/5 border-white/5 text-[#C2C7DC] hover:bg-white/[0.08]'
                } ${task.status !== 'IN_PROGRESS' ? 'opacity-85 pointer-events-none' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checklist[key]}
                  onChange={() => handleCheckboxChange(key)}
                  disabled={task.status !== 'IN_PROGRESS'}
                  className="rounded border-white/15 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-[#0A0E27]"
                />
                <span className="text-sm font-medium">
                  {/* Human-readable label */}
                  {key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Photographic evidence section */}
      <GlassCard className="p-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2.5 mb-4">
          <Camera className="w-5 h-5 text-[#D4AF37]" />
          Preuves photo & État des lieux
        </h2>

        {/* Upload field */}
        {task.status === 'IN_PROGRESS' && (
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.08] rounded-xl p-5 cursor-pointer transition-all duration-200">
              <Camera className="w-8 h-8 text-[#8E96BD] mb-2" />
              <span className="text-sm font-semibold text-white">Prendre / Choisir une photo</span>
              <span className="text-xs text-[#8E96BD] mt-1">Les photos sont enregistrées en temps réel</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                disabled={uploadPhotoMut.isPending}
                className="hidden"
              />
            </label>
            {uploadPhotoMut.isPending && (
              <p className="text-xs text-[#D4AF37] mt-2 text-center animate-pulse">
                Téléversement de la photo en cours...
              </p>
            )}
          </div>
        )}

        {/* Photo Gallery */}
        {task.photos.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#8E96BD]">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Aucune photo ajoutée pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {task.photos.map((p) => (
              <div key={p.id} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black">
                <img
                  src={p.url}
                  alt="Preuve"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 text-[10px] text-white truncate">
                  {new Date(p.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Staff actions & notes (for IN_PROGRESS status) */}
      {task.status === 'IN_PROGRESS' && (
        <GlassCard className="p-5 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2.5 mb-2">
            Rapport du personnel
          </h2>

          <GlassInput
            label="Notes du personnel (facultatif)"
            value={staffNotes}
            onChange={(e) => setStaffNotes(e.target.value)}
            placeholder="Ex: Tache de café sur le tapis nettoyée, reste un peu humide..."
          />

          {/* Issue reporting */}
          <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl space-y-3">
            <label className="flex items-center gap-2 text-sm text-red-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={issueReported}
                onChange={(e) => setIssueReported(e.target.checked)}
                className="rounded border-red-400/20 bg-white/5 text-red-500 focus:ring-red-500 focus:ring-offset-[#0A0E27]"
              />
              ⚠️ Signaler un problème / dégât
            </label>

            {issueReported && (
              <GlassInput
                label="Description du problème"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Ex: Robinet de douche qui fuit, ampoule grillée..."
                required
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <GradientButton
              onClick={handleComplete}
              variant="primary"
              className="flex-1"
              isLoading={completeMut.isPending}
            >
              {issueReported ? "Signaler et Repasser en Attente" : "Terminer et Soumettre pour Inspection"}
            </GradientButton>
          </div>
        </GlassCard>
      )}

      {/* Workflow controls for PENDING/REJECTED */}
      {(task.status === 'PENDING' || task.status === 'REJECTED') && (
        <div className="flex gap-4">
          <GradientButton
            onClick={handleStart}
            variant="primary"
            className="w-full py-4 text-base font-semibold"
            isLoading={startMut.isPending}
          >
            Démarrer le Nettoyage
          </GradientButton>
        </div>
      )}

      {/* Supervisor Inspection (for COMPLETED tasks) */}
      {task.status === 'COMPLETED' && (
        <GlassCard className="p-5 space-y-4 border border-[#D4AF37]/20">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2.5 mb-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            Inspection Qualité (Superviseur)
          </h2>

          {isManagerOrAdmin ? (
            <>
              <GlassInput
                label="Notes d'inspection (facultatif)"
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                placeholder="Ex: Parfait, lit bien tendu, rien à redire..."
              />
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleInspect(false)}
                  disabled={inspectMut.isPending}
                  className="flex-1 py-3 px-4 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/15 text-red-300 text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Rejeter (À refaire)
                </button>
                <button
                  onClick={() => handleInspect(true)}
                  disabled={inspectMut.isPending}
                  className="flex-1 py-3 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-300 text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Valider & Rendre Prête
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#8E96BD] text-center py-2">
              En attente d'inspection par un superviseur ou manager.
            </p>
          )}
        </GlassCard>
      )}

      {/* Inspected summary card */}
      {task.status === 'INSPECTED' && (
        <GlassCard className="p-5 border border-emerald-500/10 bg-emerald-500/[0.02] space-y-3">
          <h3 className="font-semibold text-emerald-300 flex items-center gap-1.5">
            <Check className="w-5 h-5" /> Tâche validée avec succès
          </h3>
          {task.inspectedBy && (
            <p className="text-xs text-[#C2C7DC]">
              Inspecté par : {task.inspectedBy.firstName} {task.inspectedBy.lastName} le {new Date(task.inspectedAt!).toLocaleString()}
            </p>
          )}
          {task.inspectorNotes && (
            <p className="text-sm text-[#8E96BD] italic">
              "{task.inspectorNotes}"
            </p>
          )}
        </GlassCard>
      )}
    </div>
  );
}
