import React, { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, RefreshCw, ChevronRight, Pin, Clock, User } from 'lucide-react';
import { useHousekeepingTasks, useRoomsWithStatus, useStartTask, useCompleteTask } from '@/hooks/useHousekeeping';
import type { HousekeepingTask } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: HousekeepingTask['status']): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'INSPECTED':
    case 'COMPLETED':
      return { bg: '#d1fae5', text: '#065f46', dot: '#10b981' };
    case 'IN_PROGRESS':
      return { bg: '#fef9c3', text: '#713f12', dot: '#f59e0b' };
    case 'REJECTED':
      return { bg: '#fee2e2', text: '#7f1d1d', dot: '#ef4444' };
    default:
      return { bg: '#e2e8f0', text: '#475569', dot: '#94a3b8' };
  }
}

function typeLabel(type: HousekeepingTask['type']): string {
  const map: Record<string, string> = {
    CHECKOUT_CLEAN: 'Checkout Clean',
    STAYOVER: 'Stayover',
    DEEP_CLEAN: 'Nettoyage profond',
    INSPECTION: 'Inspection',
    TURNDOWN: 'Couverture',
  };
  return map[type] ?? type;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-pulse">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-28 rounded-xl bg-white/20" />
      ))}
    </div>
  );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-red-400 py-16">
      <AlertCircle className="w-10 h-10" />
      <p className="text-sm font-mono">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-400/40 hover:bg-red-500/10 transition-colors text-sm"
      >
        <RefreshCw className="w-4 h-4" /> Réessayer
      </button>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, onStart, onComplete }: {
  task: HousekeepingTask;
  onStart: () => void;
  onComplete: () => void;
}) {
  const colors = statusColor(task.status);
  return (
    <div
      className="rounded-xl p-4 border flex flex-col gap-3 transition-all hover:shadow-md"
      style={{
        backgroundColor: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Room + type */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-800 text-lg leading-tight">
            Ch. {task.room?.number ?? '—'}
          </p>
          <p className="text-xs text-gray-500">{typeLabel(task.type)}</p>
        </div>
        <span
          className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Assignee */}
      {task.assignee && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <User className="w-3 h-3" />
          <span>{task.assignee.firstName} {task.assignee.lastName}</span>
        </div>
      )}

      {/* Guest */}
      {task.reservation?.guest && (
        <div className="text-xs text-gray-500 truncate">
          Guest: {task.reservation.guest.firstName} {task.reservation.guest.lastName}
        </div>
      )}

      {/* Due */}
      {task.dueAt && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{new Date(task.dueAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        {task.status === 'PENDING' && (
          <button
            onClick={onStart}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: '#fef9c3', color: '#713f12' }}
          >
            Démarrer
          </button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <button
            onClick={onComplete}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-white transition-colors flex items-center justify-center gap-1"
            style={{ backgroundColor: '#059669' }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Terminer
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HousekeepingDashboard() {
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterFloor, setFilterFloor] = useState<string>('');

  const { data: tasks, isLoading, isError, refetch } = useHousekeepingTasks(
    filterStatus ? { status: filterStatus } : {}
  );
  const startTask = useStartTask();
  const completeTask = useCompleteTask();

  const displayedTasks = useMemo(() => {
    let list = tasks ?? [];
    if (filterFloor) list = list.filter((t) => String(t.room?.floor) === filterFloor);
    return list;
  }, [tasks, filterFloor]);

  const stats = useMemo(() => {
    const all = tasks ?? [];
    return {
      clean: all.filter((t) => t.status === 'INSPECTED' || t.status === 'COMPLETED').length,
      inProgress: all.filter((t) => t.status === 'IN_PROGRESS').length,
      pending: all.filter((t) => t.status === 'PENDING').length,
      rejected: all.filter((t) => t.status === 'REJECTED').length,
      total: all.length,
    };
  }, [tasks]);

  const floors = useMemo(() => {
    const s = new Set<number>();
    (tasks ?? []).forEach((t) => { if (t.room?.floor) s.add(t.room.floor); });
    return Array.from(s).sort();
  }, [tasks]);

  return (
    <div
      className="w-full min-h-screen p-6 flex flex-col gap-6"
      style={{
        background: 'linear-gradient(135deg, #e0eaf5 0%, #f4f6f9 100%)',
        backgroundAttachment: 'fixed',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Pin className="w-5 h-5 text-blue-500" /> Housekeeping Matrix
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivi temps-réel — {stats.total} tâche{stats.total !== 1 ? 's' : ''} actives
            {isLoading && <Loader2 className="inline w-3.5 h-3.5 animate-spin ml-2" />}
          </p>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Terminées', count: stats.clean, color: '#10b981', bg: '#d1fae5' },
            { label: 'En cours', count: stats.inProgress, color: '#f59e0b', bg: '#fef9c3' },
            { label: 'À faire', count: stats.pending, color: '#6366f1', bg: '#ede9fe' },
            { label: 'Rejetées', count: stats.rejected, color: '#ef4444', bg: '#fee2e2' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: s.bg, color: s.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.count} {s.label}
            </div>
          ))}
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <div className="flex gap-2">
          {[
            { v: '', l: 'Toutes' },
            { v: 'PENDING', l: 'À faire' },
            { v: 'IN_PROGRESS', l: 'En cours' },
            { v: 'COMPLETED', l: 'Terminées' },
            { v: 'INSPECTED', l: 'Inspectées' },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setFilterStatus(v)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: filterStatus === v ? '#3b82f6' : 'rgba(255,255,255,0.7)',
                color: filterStatus === v ? '#fff' : '#374151',
                border: filterStatus === v ? 'none' : '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Floor filter */}
        {floors.length > 0 && (
          <select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm border bg-white/70 text-gray-700 focus:outline-none"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <option value="">Tous les étages</option>
            {floors.map((f) => (
              <option key={f} value={String(f)}>Étage {f}</option>
            ))}
          </select>
        )}

        <button
          onClick={() => refetch()}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 bg-white/70 hover:bg-white transition-colors border"
          style={{ border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualiser
        </button>
      </div>

      {/* Grid */}
      {isError ? (
        <ErrorBanner message="Impossible de charger les tâches de housekeeping" onRetry={refetch} />
      ) : isLoading ? (
        <Skeleton />
      ) : displayedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <CheckCircle2 className="w-12 h-12 opacity-40" />
          <p className="font-medium">Aucune tâche pour ce filtre</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {displayedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStart={() => startTask.mutate(task.id)}
              onComplete={() => completeTask.mutate({ taskId: task.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
