'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi, type Task, type TaskStatus, usersApi } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Modal } from '@/components/ui/Modal';
import { GlassInput } from '@/components/ui/GlassInput';
import { Select } from '@/components/ui/Select';
import { TaskStatusBadge } from '@/components/ui/StatusBadge';
import { clsx } from 'clsx';

const COLUMNS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function TasksPage() {
  const t = useTranslations();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.list({ pageSize: 100 }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) => tasksApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const createMut = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setOpen(false); },
  });

  const byStatus = (status: TaskStatus) => data?.items.filter((task) => task.status === status) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold" style={{ color: '#E6E8F2' }}>
            {t('tasks.title')}
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#8E96BD' }}>
            {data?.items.length ?? 0} tâches
          </p>
        </div>
        <GradientButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)} variant="primary">
          {t('tasks.newTask')}
        </GradientButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {COLUMNS.map((status) => (
          <GlassCard key={status} className="min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <TaskStatusBadge status={status} />
              <span className="text-xs" style={{ color: '#8E96BD' }}>{byStatus(status).length}</span>
            </div>
            <div className="space-y-3">
              {byStatus(status).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAdvance={() => {
                    const next: Record<TaskStatus, TaskStatus> = {
                      PENDING: 'IN_PROGRESS',
                      IN_PROGRESS: 'COMPLETED',
                      COMPLETED: 'COMPLETED',
                      CANCELLED: 'CANCELLED',
                    };
                    updateMut.mutate({ id: task.id, data: { status: next[task.status] } });
                  }}
                />
              ))}
              {byStatus(status).length === 0 && (
                <p className="text-xs text-center py-6" style={{ color: '#5A659E' }}>—</p>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <CreateTaskModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(payload) => createMut.mutate(payload)}
        isLoading={createMut.isPending}
      />
    </div>
  );
}

function TaskCard({ task, onAdvance }: { task: Task; onAdvance: () => void }) {
  const priorityColor = task.priority >= 4 ? 'text-red-400' : task.priority >= 2 ? 'text-amber-400' : 'text-[#8E96BD]';
  return (
    <div className="glass rounded-xl p-3 space-y-2 hover:bg-white/[0.07] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug" style={{ color: '#E6E8F2' }}>{task.title}</p>
        <AlertCircle className={clsx('w-3.5 h-3.5 flex-shrink-0', priorityColor)} />
      </div>
      {task.description && <p className="text-xs line-clamp-2" style={{ color: '#C2C7DC' }}>{task.description}</p>}
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: '#5A659E' }}>
          {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName[0]}.` : 'Non assigné'}
        </span>
        {task.status !== 'COMPLETED' && (
          <button
            onClick={onAdvance}
            className="text-xs hover:text-[#F5E8B8]"
            style={{ color: '#D4AF37' }}
          >
            {task.status === 'PENDING' ? 'Démarrer' : 'Terminer'} →
          </button>
        )}
      </div>
    </div>
  );
}

function CreateTaskModal({
  open, onClose, onSubmit, isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; priority?: number; assigneeId?: string }) => void;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [assigneeId, setAssigneeId] = useState('');

  const { data: users } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => usersApi.list({ pageSize: 100 }),
    enabled: open,
  });

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle tâche">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ title, description: description || undefined, priority, assigneeId: assigneeId || undefined });
        }}
        className="space-y-4"
      >
        <GlassInput label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div className="w-full">
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#C2C7DC' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl glass focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.5)]"
            style={{ color: '#E6E8F2' }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priorité"
            value={String(priority)}
            onChange={(e) => setPriority(Number(e.target.value))}
            options={[
              { value: '1', label: 'Basse' },
              { value: '2', label: 'Normale' },
              { value: '3', label: 'Haute' },
              { value: '4', label: 'Urgente' },
              { value: '5', label: 'Critique' },
            ]}
          />
          <Select
            label="Assigné à"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            options={[
              { value: '', label: 'Non assigné' },
              ...(users?.items.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` })) ?? []),
            ]}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <GradientButton type="button" variant="ghost" onClick={onClose}>Annuler</GradientButton>
          <GradientButton type="submit" variant="primary" isLoading={isLoading}>Créer</GradientButton>
        </div>
      </form>
    </Modal>
  );
}
