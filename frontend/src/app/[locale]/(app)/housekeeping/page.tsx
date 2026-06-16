'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@/i18n/routing';
import {
  Brush,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
  housekeepingApi,
  roomsApi,
  type HousekeepingTask,
  type HousekeepingStatus,
  type HousekeepingType,
  type Room
} from '@/lib/api-client';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import {
  HousekeepingStatusBadge,
  HousekeepingTypeBadge
} from '@/components/ui/StatusBadge';
import { toApiError } from '@/lib/api';

export default function HousekeepingListPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const qc = useQueryClient();
  
  const isStaff = user?.role === 'STAFF';
  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const [searchRoom, setSearchRoom] = useState('');
  const [statusFilter, setStatusFilter] = useState<HousekeepingStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<HousekeepingType | ''>('');
  const [showOnlyMine, setShowOnlyMine] = useState(isStaff);
  const [openStayoverModal, setOpenStayoverModal] = useState(false);

  // Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['housekeeping', 'stats'],
    queryFn: () => housekeepingApi.getMyStats(),
  });

  // Rooms list (for creating stayover task)
  const { data: roomsData } = useQuery({
    queryKey: ['rooms-all'],
    queryFn: () => roomsApi.list({ pageSize: 100 }),
    enabled: isManagerOrAdmin,
  });

  // Main task list query
  const { data, isLoading, page, setPage } = usePaginatedQuery<HousekeepingTask>(
    'housekeeping-tasks',
    (params) =>
      housekeepingApi.list({
        ...params,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(showOnlyMine && user ? { assigneeId: user.id } : {}),
      })
  );

  const createStayoverMut = useMutation({
    mutationFn: housekeepingApi.createStayover,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['housekeeping-tasks'] });
      qc.invalidateQueries({ queryKey: ['housekeeping', 'stats'] });
      setOpenStayoverModal(false);
    },
  });

  // Filter tasks locally by room number if search is typed
  const filteredTasks = data?.items.filter((task) => {
    if (!searchRoom) return true;
    return task.room.number.toLowerCase().includes(searchRoom.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-gray-900 flex items-center gap-2">
            <Brush className="w-8 h-8 text-amber-500" />
            {t('housekeeping.title')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isStaff ? t('housekeeping.myTasks') : t('housekeeping.allTasks')}
          </p>
        </div>
        
        {isManagerOrAdmin && (
          <GradientButton
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setOpenStayoverModal(true)}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Nouvelle Tâche
          </GradientButton>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="w-10 h-10 rounded-xl bg-white/70 border border-gray-200 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">En Attente</p>
            <h3 className="text-2xl font-semibold text-gray-900 mt-1">
              {statsLoading ? '...' : stats?.pending ?? 0}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">En Cours</p>
            <h3 className="text-2xl font-semibold text-gray-900 mt-1">
              {statsLoading ? '...' : stats?.inProgress ?? 0}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Fait Aujourd'hui</p>
            <h3 className="text-2xl font-semibold text-gray-900 mt-1">
              {statsLoading ? '...' : stats?.completedToday ?? 0}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">En Retard</p>
            <h3 className="text-2xl font-semibold text-gray-900 mt-1">
              {statsLoading ? '...' : stats?.overdue ?? 0}
            </h3>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <GlassInput
              placeholder="Rechercher une chambre (ex: 101)..."
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          
          <div className="grid grid-cols-2 md:flex gap-3">
            <div className="w-full md:w-44">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as HousekeepingStatus | '')}
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'PENDING', label: t('housekeeping.status.PENDING') },
                  { value: 'IN_PROGRESS', label: t('housekeeping.status.IN_PROGRESS') },
                  { value: 'COMPLETED', label: t('housekeeping.status.COMPLETED') },
                  { value: 'INSPECTED', label: t('housekeeping.status.INSPECTED') },
                  { value: 'REJECTED', label: t('housekeeping.status.REJECTED') },
                ]}
              />
            </div>

            <div className="w-full md:w-44">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as HousekeepingType | '')}
                options={[
                  { value: '', label: 'Tous les types' },
                  { value: 'CHECKOUT_CLEAN', label: t('housekeeping.type.CHECKOUT_CLEAN') },
                  { value: 'STAYOVER', label: t('housekeeping.type.STAYOVER') },
                  { value: 'DEEP_CLEAN', label: t('housekeeping.type.DEEP_CLEAN') },
                  { value: 'INSPECTION', label: t('housekeeping.type.INSPECTION') },
                  { value: 'TURNDOWN', label: t('housekeeping.type.TURNDOWN') },
                ]}
              />
            </div>
          </div>

          {!isStaff && (
            <div className="flex items-center justify-end">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyMine}
                  onChange={(e) => setShowOnlyMine(e.target.checked)}
                  className="rounded border-gray-200 bg-white text-blue-600 focus:ring-blue-500 focus:ring-offset-white"
                />
                Voir uniquement mes tâches
              </label>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Task List (Mobile-First Cards) */}
      <div className="space-y-3">
        {isLoading ? (
          <GlassCard className="p-8 text-center text-gray-500">
            {t('common.appName')}... {t('common.loading')}
          </GlassCard>
        ) : filteredTasks?.length === 0 ? (
          <GlassCard className="p-8 text-center text-gray-500">
            Aucune tâche trouvée
          </GlassCard>
        ) : (
          filteredTasks?.map((task) => {
            const isTaskOverdue = task.dueAt ? new Date(task.dueAt) < new Date() && task.status !== 'INSPECTED' : false;
            
            return (
              <Link key={task.id} href={`/housekeeping/${task.id}`} className="block">
                <GlassCard className="p-4 hover:bg-white/60 transition-colors duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-mono font-semibold text-gray-900">
                          Chambre {task.room.number}
                        </span>
                        <span className="text-xs text-gray-500 bg-white/70 px-2 py-0.5 rounded-full border border-gray-100">
                          Étage {task.room.floor} • {task.room.type}
                        </span>
                        {isTaskOverdue && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> En Retard
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <HousekeepingTypeBadge type={task.type} />
                        <span className="text-gray-300">•</span>
                        <span>Priorité {task.priority}</span>
                        {task.assignee && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="truncate">
                              Assigné à: {task.assignee.firstName} {task.assignee.lastName[0]}.
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <HousekeepingStatusBadge status={task.status} />
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  {task.dueAt && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Échéance : {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(task.dueAt).toLocaleDateString()})</span>
                    </div>
                  )}
                </GlassCard>
              </Link>
            );
          })
        )}
      </div>

      {data && (
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Modal stayover task creation */}
      {isManagerOrAdmin && (
        <StayoverModal
          open={openStayoverModal}
          onClose={() => setOpenStayoverModal(false)}
          rooms={roomsData?.items ?? []}
          onSubmit={(payload) => createStayoverMut.mutate(payload, {
            onError: (err) => alert(toApiError(err).message),
          })}
          isLoading={createStayoverMut.isPending}
        />
      )}
    </div>
  );
}

function StayoverModal({
  open,
  onClose,
  rooms,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  rooms: Room[];
  onSubmit: (data: { roomId: string; dueInHours?: number; notes?: string }) => void;
  isLoading: boolean;
}) {
  const [roomId, setRoomId] = useState('');
  const [dueInHours, setDueInHours] = useState(3);
  const [notes, setNotes] = useState('');

  const roomOptions = rooms.map((r) => ({
    value: r.id,
    label: `Chambre ${r.number} (${r.type} - Étage ${r.floor})`,
  }));

  return (
    <Modal open={open} onClose={onClose} title="Créer une tâche d'entretien">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ roomId, dueInHours: Number(dueInHours), notes });
        }}
        className="space-y-4"
      >
        <Select
          label="Chambre"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          options={[{ value: '', label: 'Sélectionner une chambre' }, ...roomOptions]}
          required
        />

        <GlassInput
          label="Échéance (dans combien d'heures)"
          type="number"
          min={1}
          max={24}
          value={dueInHours}
          onChange={(e) => setDueInHours(Number(e.target.value))}
          required
        />

        <GlassInput
          label="Notes / Instructions spéciales"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Changer les draps en lin, ajouter des bouteilles d'eau..."
        />

        <div className="flex justify-end gap-2 pt-2">
          <GradientButton type="button" variant="ghost" onClick={onClose}>
            Annuler
          </GradientButton>
          <GradientButton type="submit" variant="primary" isLoading={isLoading} disabled={!roomId}>
            Créer la Tâche
          </GradientButton>
        </div>
      </form>
    </Modal>
  );
}
