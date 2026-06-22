'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle2, Camera, AlertTriangle, UploadCloud } from 'lucide-react';
import { housekeepingApi, type HousekeepingTask } from '@/lib/api-client';
import { toApiError } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { HousekeepingStatusBadge } from '@/components/housekeeping/HousekeepingStatusBadge';

export default function HousekeepingTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [task, setTask] = useState<HousekeepingTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioning, setActioning] = useState(false);
  const [issueReported, setIssueReported] = useState(false);
  const [issueDesc, setIssueDesc] = useState('');
  
  // Minimal static checklist for demo purposes (can be dynamic via task.checklist)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    bed: false,
    bathroom: false,
    vacuum: false,
    trash: false,
    supplies: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await housekeepingApi.get(id);
      setTask(data);
      if (data.checklist) {
        try { setChecklist(JSON.parse(data.checklist)); } catch {}
      }
      setIssueReported(data.issueReported);
      setIssueDesc(data.issueDescription || '');
    } catch (e) {
      setError(toApiError(e).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTask(); }, [id]);

  const handleStart = async () => {
    setActioning(true);
    try {
      await housekeepingApi.start(id);
      await loadTask();
    } catch (e) {
      alert(toApiError(e).message);
    } finally {
      setActioning(false);
    }
  };

  const handleComplete = async () => {
    setActioning(true);
    try {
      await housekeepingApi.complete(id, {
        checklist,
        issueReported,
        issueDescription: issueReported ? issueDesc : undefined,
      });
      await loadTask();
    } catch (e) {
      alert(toApiError(e).message);
    } finally {
      setActioning(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      await housekeepingApi.uploadPhoto(id, file);
      await loadTask(); // Reload to show the new photo
    } catch (e) {
      alert(toApiError(e).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="font-medium">{error || 'Tâche introuvable'}</p>
        <Link href="/housekeeping" className="text-sm text-blue-600 hover:underline">← Retour</Link>
      </div>
    );
  }

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24">
      {/* App-like Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/housekeeping" className="p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chambre {task.room.number}</h1>
            <p className="text-sm text-gray-500">{task.room.type} • {task.type}</p>
          </div>
        </div>
        <HousekeepingStatusBadge status={task.status} />
      </div>

      {/* Main Action Area */}
      {task.status === 'PENDING' && (
        <button
          onClick={handleStart}
          disabled={actioning}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Play className="w-6 h-6" />
          Commencer le nettoyage
        </button>
      )}

      {['IN_PROGRESS', 'COMPLETED', 'INSPECTED'].includes(task.status) && (
        <div className="space-y-6">
          <GlassCard>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Checklist</h2>
            <div className="space-y-3">
              {[
                { key: 'bed', label: 'Lits faits & draps changés' },
                { key: 'bathroom', label: 'Salle de bain nettoyée' },
                { key: 'vacuum', label: 'Aspirateur passé' },
                { key: 'trash', label: 'Poubelles vidées' },
                { key: 'supplies', label: 'Produits d\'accueil réassortis' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={task.status !== 'IN_PROGRESS'}
                    checked={checklist[item.key]}
                    onChange={(e) => setChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm font-medium ${checklist[item.key] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Photos (Preuves)</h2>
              {task.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100"
                >
                  {uploading ? <UploadCloud className="w-4 h-4 animate-bounce" /> : <Camera className="w-4 h-4" />}
                  Ajouter
                </button>
              )}
            </div>
            
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
            />

            {task.photos?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {task.photos.map(p => (
                  <div key={p.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="Preuve" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Aucune photo ajoutée.</p>
            )}
          </GlassCard>

          <GlassCard>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                disabled={task.status !== 'IN_PROGRESS'}
                checked={issueReported}
                onChange={(e) => setIssueReported(e.target.checked)}
                className="w-5 h-5 rounded text-red-600 focus:ring-red-500"
              />
              <span className="font-medium text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Signaler un problème
              </span>
            </label>
            
            {issueReported && (
              <textarea
                disabled={task.status !== 'IN_PROGRESS'}
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="Ex: Ampoule grillée, moquette tachée..."
                className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                rows={3}
              />
            )}
          </GlassCard>

          {task.status === 'IN_PROGRESS' && (
            <button
              onClick={handleComplete}
              disabled={actioning || !allChecked}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-6 h-6" />
              Marquer comme terminé
            </button>
          )}

          {task.status === 'COMPLETED' && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-200 text-center text-sm font-medium">
              ✅ Chambre nettoyée avec succès. En attente d'inspection.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
