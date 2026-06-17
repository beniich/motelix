'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Search } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi, type Room, type RoomStatus } from '@/lib/api-client';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { toApiError } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { RoomStatusBadge } from '@/components/ui/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/lib/auth';

export default function RoomsPage() {
  const t = useTranslations();
  const { user } = useAuth();
  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const qc = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | ''>('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const { data, isLoading, page, setPage } = usePaginatedQuery<Room>(
    'rooms',
    (params) => roomsApi.list({
      ...params,
      ...(statusFilter ? { status: statusFilter as RoomStatus } : {}),
    })
  );

  const createMut = useMutation({
    mutationFn: roomsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rooms'] }); setOpen(false); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof roomsApi.update>[1] }) =>
      roomsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rooms'] }); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: roomsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rooms'] }),
  });

  const filtered = data?.items.filter((r) =>
    !search || r.number.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-gray-900">
            {t('rooms.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {data?.pagination.total ?? 0} chambres
          </p>
        </div>
        {canEdit && (
          <GradientButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)} variant="primary">
            {t('common.create')}
          </GradientButton>
        )}
      </div>

      <GlassCard>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <GlassInput
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="md:w-56">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RoomStatus | '')}
              options={[
                { value: '', label: 'Tous les statuts' },
                { value: 'AVAILABLE', label: t('rooms.status.AVAILABLE') },
                { value: 'OCCUPIED', label: t('rooms.status.OCCUPIED') },
                { value: 'CLEANING', label: t('rooms.status.CLEANING') },
                { value: 'MAINTENANCE', label: t('rooms.status.MAINTENANCE') },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider border-b border-gray-100 text-gray-500">
                <th className="py-3 px-2">{t('rooms.number')}</th>
                <th className="py-3 px-2">{t('rooms.floor')}</th>
                <th className="py-3 px-2">{t('rooms.type')}</th>
                <th className="py-3 px-2">{t('rooms.price')}</th>
                <th className="py-3 px-2">{t('rooms.status')}</th>
                {canEdit && <th className="py-3 px-2 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">{t('common.loading')}</td></tr>
              ) : filtered?.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Aucune chambre</td></tr>
              ) : (
                filtered?.map((room) => (
                  <tr key={room.id} className="border-b border-gray-50 hover:bg-white/60 transition-colors">
                    <td className="py-3 px-2 font-mono font-medium text-gray-900">{room.number}</td>
                    <td className="py-3 px-2 text-gray-600">{room.floor}</td>
                    <td className="py-3 px-2 text-gray-600">{room.type}</td>
                    <td className="py-3 px-2 font-semibold text-amber-600">{room.price}€</td>
                    <td className="py-3 px-2"><RoomStatusBadge status={room.status} /></td>
                    {canEdit && (
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => setEditing(room)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {t('common.edit')}
                        </button>
                        {user?.role === 'ADMIN' && (
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer la chambre ${room.number} ?`)) {
                                deleteMut.mutate(room.id);
                              }
                            }}
                            className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                          >
                            {t('common.delete')}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </GlassCard>

      <RoomFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(payload) => createMut.mutate(payload, {
          onError: (e) => alert(toApiError(e).message),
        })}
        isLoading={createMut.isPending}
      />
      <RoomFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        initial={editing ?? undefined}
        onSubmit={(payload) => editing && updateMut.mutate({ id: editing.id, data: payload }, {
          onError: (e) => alert(toApiError(e).message),
        })}
        isLoading={updateMut.isPending}
      />
    </div>
  );
}

function RoomFormModal({
  open, onClose, onSubmit, isLoading, initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { number: string; floor: number; type: string; price: number; status?: RoomStatus }) => void;
  isLoading: boolean;
  initial?: Room;
}) {
  const [number, setNumber] = useState(initial?.number ?? '');
  const [floor, setFloor] = useState(initial?.floor ?? 1);
  const [type, setType] = useState(initial?.type ?? 'Standard');
  const [price, setPrice] = useState(initial?.price ?? 200);
  const [status, setStatus] = useState<RoomStatus>(initial?.status ?? 'AVAILABLE');
  const t = useTranslations();

  return (
    <Modal open={open} onClose={onClose} title={initial ? t('common.edit') : t('common.create')}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ number, floor: Number(floor), type, price: Number(price), status });
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <GlassInput label={t('rooms.number')} value={number} onChange={(e) => setNumber(e.target.value)} required />
          <GlassInput label={t('rooms.floor')} type="number" value={floor} onChange={(e) => setFloor(Number(e.target.value))} required />
        </div>
        <Select
          label={t('rooms.type')}
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: 'Standard', label: 'Standard' },
            { value: 'Deluxe', label: 'Deluxe' },
            { value: 'Suite', label: 'Suite' },
            { value: 'Penthouse', label: 'Penthouse' },
          ]}
        />
        <GlassInput label={t('rooms.price')} type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        <Select
          label={t('rooms.status')}
          value={status}
          onChange={(e) => setStatus(e.target.value as RoomStatus)}
          options={[
            { value: 'AVAILABLE', label: t('rooms.status.AVAILABLE') },
            { value: 'OCCUPIED', label: t('rooms.status.OCCUPIED') },
            { value: 'CLEANING', label: t('rooms.status.CLEANING') },
            { value: 'MAINTENANCE', label: t('rooms.status.MAINTENANCE') },
          ]}
        />
        <div className="flex justify-end gap-2 pt-2">
          <GradientButton type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</GradientButton>
          <GradientButton type="submit" variant="primary" isLoading={isLoading}>
            {t('common.save')}
          </GradientButton>
        </div>
      </form>
    </Modal>
  );
}
