'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { X, Plus, Search } from 'lucide-react';
import { invoicesApi, type Invoice } from '@/lib/api-client';
import { api } from '@/lib/api';
import { GradientButton } from '@/components/ui/GradientButton';
import { Select } from '@/components/ui/Select';
import { useDebounce } from '@/hooks/useDebounce';

type ReservationOption = {
  id: string;
  reference: string;
  guest: { firstName: string; lastName: string };
  checkIn: string;
  checkOut: string;
};

export function CreateInvoiceModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (invoice: Invoice) => void }) {
  const queryClient = useQueryClient();
  const [reservationId, setReservationId] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: reservations } = useQuery({
    queryKey: ['reservations', 'search', debouncedSearch],
    queryFn: () => api.get<{ items: ReservationOption[] }>('/api/reservations', { params: { search: debouncedSearch, status: 'CHECKED_OUT' } }).then(r => r.data.items),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: (data: { reservationId: string }) => invoicesApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onCreated(data);
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-midnight-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-display font-semibold text-midnight-50">Nouvelle Facture</h2>
          <button onClick={onClose} className="p-2 text-midnight-200 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-midnight-200">Réservation à facturer</label>
            <Select
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              options={[
                { value: '', label: 'Sélectionner une réservation...' },
                ...(reservations || []).map(r => ({
                  value: r.id,
                  label: `${r.reference} - ${r.guest.lastName} ${r.guest.firstName}`,
                }))
              ]}
            />
            <p className="text-xs text-midnight-200 mt-1">Seules les réservations sans facture apparaissent ici.</p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-midnight-200 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <GradientButton
              onClick={() => createMutation.mutate({ reservationId })}
              disabled={!reservationId || createMutation.isPending}
            >
              {createMutation.isPending ? 'Création...' : 'Créer la facture'}
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
}
