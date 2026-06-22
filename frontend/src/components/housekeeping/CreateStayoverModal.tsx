'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { housekeepingApi, type Room } from '@/lib/api-client';
import { toApiError } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { GradientButton } from '@/components/ui/GradientButton';

interface Props {
  open: boolean;
  onClose: () => void;
  rooms: Room[]; // Ideally passed to select a room quickly
}

export function CreateStayoverModal({ open, onClose, rooms }: Props) {
  const queryClient = useQueryClient();
  const [roomId, setRoomId] = useState('');
  const [dueInHours, setDueInHours] = useState(24);
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');

  const mutation = useMutation({
    mutationFn: () => housekeepingApi.createStayover({
      roomId,
      dueInHours: dueInHours > 0 ? dueInHours : undefined,
      notes: notes || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
      setRoomId('');
      setNotes('');
      onClose();
    },
    onError: (e) => setErr(toApiError(e).message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    mutation.mutate();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouveau Recouche (Stayover)" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Chambre *</label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">Sélectionner une chambre</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.number} ({r.type})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Délai (heures) *</label>
          <input
            type="number"
            min={1}
            max={72}
            value={dueInHours}
            onChange={(e) => setDueInHours(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Notes pour le nettoyage</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Changement de draps requis..."
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {err && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {err}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <GradientButton type="submit" disabled={mutation.isPending || !roomId}>
            {mutation.isPending ? 'Création...' : 'Assigner recouche'}
          </GradientButton>
        </div>
      </form>
    </Modal>
  );
}
