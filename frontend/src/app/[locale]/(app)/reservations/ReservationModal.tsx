'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar } from 'lucide-react';
import { reservationsApi, guestsApi, roomsApi, type Reservation } from '@/lib/api-client';
import { format } from 'date-fns';

export default function ReservationModal({ 
  reservation, 
  onClose 
}: { 
  reservation: Reservation | null; 
  onClose: () => void 
}) {
  const queryClient = useQueryClient();
  const isEditing = !!reservation;

  const [formData, setFormData] = useState({
    guestId: reservation?.guestId || '',
    roomId: reservation?.roomId || '',
    checkIn: reservation ? format(new Date(reservation.checkIn), 'yyyy-MM-dd') : '',
    checkOut: reservation ? format(new Date(reservation.checkOut), 'yyyy-MM-dd') : '',
    source: reservation?.source || 'DIRECT',
    discount: reservation?.discount?.toString() || '0',
    extras: reservation?.extras?.toString() || '0',
    notes: reservation?.notes || '',
  });

  const { data: guestsData } = useQuery({
    queryKey: ['guests', 'all'],
    queryFn: () => guestsApi.list({ pageSize: 100 }), // Pour MVP: on liste les 100 premiers
  });

  const { data: roomsData } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomsApi.list({ pageSize: 100 }),
  });

  const guests = guestsData?.items || [];
  const rooms = roomsData?.items || [];

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return reservationsApi.update(reservation.id, {
          notes: data.notes,
          source: data.source,
          discount: Number(data.discount),
          extras: Number(data.extras),
        });
      }
      return reservationsApi.create({
        ...data,
        discount: Number(data.discount),
        extras: Number(data.extras),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      onClose();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ action, reason }: { action: 'confirm' | 'checkIn' | 'checkOut' | 'cancel', reason?: string }) => {
      if (!reservation) throw new Error('No reservation to update');
      switch(action) {
        case 'confirm': return reservationsApi.confirm(reservation.id);
        case 'checkIn': return reservationsApi.checkIn(reservation.id);
        case 'checkOut': return reservationsApi.checkOut(reservation.id);
        case 'cancel': return reservationsApi.cancel(reservation.id, reason);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Modifier la réservation' : 'Nouvelle réservation'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {mutation.isError && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
              Une erreur est survenue. {(mutation.error as any)?.response?.data?.error || mutation.error.message}
            </div>
          )}

          <form id="reservation-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Client</label>
                <select
                  disabled={isEditing} // Ne pas changer le client d'une résa existante
                  required
                  value={formData.guestId}
                  onChange={e => setFormData({ ...formData, guestId: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                >
                  <option value="">Sélectionner un client</option>
                  {guests.map(g => (
                    <option key={g.id} value={g.id}>{g.firstName} {g.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Chambre</label>
                <select
                  disabled={isEditing}
                  required
                  value={formData.roomId}
                  onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                >
                  <option value="">Sélectionner une chambre</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.number} - {r.type} ({r.price}€/nuit)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Date d'arrivée</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    disabled={isEditing}
                    type="date"
                    required
                    value={formData.checkIn}
                    onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Date de départ</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    disabled={isEditing}
                    type="date"
                    required
                    value={formData.checkOut}
                    onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Canal de résa.</label>
                <select
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="DIRECT">Direct</option>
                  <option value="BOOKING">Booking.com</option>
                  <option value="EXPEDIA">Expedia</option>
                  <option value="AIRBNB">Airbnb</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Extras (€)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.extras}
                  onChange={e => setFormData({ ...formData, extras: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Remise (€)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Notes (internes)</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Ex: Arrivée tardive prévue..."
              />
            </div>
          </form>

          {isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Actions de statut</h3>
              <div className="flex flex-wrap gap-3">
                {reservation.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => statusMutation.mutate({ action: 'confirm' })}
                    disabled={statusMutation.isPending}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 font-medium hover:bg-blue-500/30 transition-colors text-sm disabled:opacity-50"
                  >
                    Confirmer
                  </button>
                )}
                {reservation.status === 'CONFIRMED' && (
                  <button
                    type="button"
                    onClick={() => statusMutation.mutate({ action: 'checkIn' })}
                    disabled={statusMutation.isPending}
                    className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-colors text-sm disabled:opacity-50"
                  >
                    Check-in
                  </button>
                )}
                {reservation.status === 'CHECKED_IN' && (
                  <button
                    type="button"
                    onClick={() => statusMutation.mutate({ action: 'checkOut' })}
                    disabled={statusMutation.isPending}
                    className="px-4 py-2 rounded-lg bg-slate-500/20 text-slate-300 font-medium hover:bg-slate-500/30 transition-colors text-sm disabled:opacity-50"
                  >
                    Check-out
                  </button>
                )}
                {['PENDING', 'CONFIRMED'].includes(reservation.status) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Voulez-vous vraiment annuler cette réservation ?')) {
                        statusMutation.mutate({ action: 'cancel' });
                      }
                    }}
                    disabled={statusMutation.isPending}
                    className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 font-medium hover:bg-rose-500/30 transition-colors text-sm disabled:opacity-50 ml-auto"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Fermer
          </button>
          <button
            type="submit"
            form="reservation-form"
            disabled={mutation.isPending}
            className="px-6 py-2.5 rounded-xl text-[#0A0E27] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' }}
          >
            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}
