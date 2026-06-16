'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, User } from 'lucide-react';
import { guestsApi, type Guest } from '@/lib/api-client';

export default function GuestModal({ guest, onClose }: { guest: Guest | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const isEditing = !!guest;

  const [formData, setFormData] = useState({
    firstName: guest?.firstName || '',
    lastName: guest?.lastName || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    nationality: guest?.nationality || '',
    documentType: guest?.documentType || '',
    documentNumber: guest?.documentNumber || '',
    preferences: guest?.preferences || '',
    vip: guest?.vip || false,
  });

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => {
      // Nettoyer les champs vides
      const payload = {
        ...data,
        documentType: data.documentType || undefined,
        phone: data.phone || undefined,
        nationality: data.nationality || undefined,
        documentNumber: data.documentNumber || undefined,
        preferences: data.preferences || undefined,
      };

      if (isEditing) return guestsApi.update(guest.id, payload);
      return guestsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => guestsApi.remove(guest!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0A0E27] border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
              <User size={18} />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? 'Fiche Client' : 'Nouveau Client'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {mutation.isError && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
              Une erreur est survenue. {(mutation.error as any)?.response?.data?.error || mutation.error.message}
            </div>
          )}

          {deleteMutation.isError && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
              Erreur : {(deleteMutation.error as any)?.response?.data?.error || deleteMutation.error.message}
            </div>
          )}

          <form id="guest-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Identité */}
            <div>
              <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Identité</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Prénom <span className="text-rose-500">*</span></label>
                  <input
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Nom <span className="text-rose-500">*</span></label>
                  <input
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Email <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Informations d'identité</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Nationalité</label>
                  <input
                    value={formData.nationality}
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    placeholder="ex: FR, US, CH..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Type de document</label>
                  <select
                    value={formData.documentType}
                    onChange={e => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">Aucun</option>
                    <option value="PASSPORT">Passeport</option>
                    <option value="ID_CARD">Carte d'Identité</option>
                    <option value="DRIVING_LICENSE">Permis de conduire</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">N° Document</label>
                  <input
                    value={formData.documentNumber}
                    onChange={e => setFormData({ ...formData, documentNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Préférences & VIP */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-4">Préférences & Statut</h3>
              
              <label className="flex items-center gap-3 mb-6 p-4 rounded-xl border border-white/10 bg-slate-900/50 cursor-pointer hover:bg-slate-900 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.vip}
                  onChange={e => setFormData({ ...formData, vip: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <div className="flex-1">
                  <span className="font-semibold text-white flex items-center gap-2">
                    Client VIP
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Cochez cette case pour accorder un traitement prioritaire et spécifique à ce client.
                  </p>
                </div>
              </label>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Préférences (Allergies, demandes spéciales...)</label>
                <textarea
                  rows={3}
                  value={formData.preferences}
                  onChange={e => setFormData({ ...formData, preferences: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-between bg-black/20">
          {isEditing ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Voulez-vous vraiment supprimer ce client ? Il ne doit avoir aucune réservation active.')) {
                  deleteMutation.mutate();
                }
              }}
              disabled={deleteMutation.isPending}
              className="px-4 py-2.5 rounded-xl text-rose-400 font-medium hover:bg-rose-500/10 transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </button>
          ) : (
            <div /> // Spacer
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="guest-form"
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-xl text-[#0A0E27] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' }}
            >
              {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
