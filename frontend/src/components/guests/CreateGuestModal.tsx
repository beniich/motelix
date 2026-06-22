'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { type Guest, guestsApi } from '@/lib/api-client';
import { toApiError } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { GradientButton } from '@/components/ui/GradientButton';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (guest: Guest) => void;
}

export function CreateGuestModal({ open, onClose, onCreated }: Props) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    documentType: 'PASSPORT',
    documentNumber: '',
    vip: false,
    preferences: '',
  });
  const [err, setErr] = useState('');

  const mutation = useMutation({
    mutationFn: () => guestsApi.create(formData),
    onSuccess: (newGuest) => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', nationality: '',
        documentType: 'PASSPORT', documentNumber: '', vip: false, preferences: ''
      });
      onCreated?.(newGuest);
      onClose();
    },
    onError: (e) => setErr(toApiError(e).message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    mutation.mutate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouveau Client" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Prénom *</label>
            <input
              type="text" name="firstName" required
              value={formData.firstName} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nom *</label>
            <input
              type="text" name="lastName" required
              value={formData.lastName} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
            <input
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Téléphone</label>
            <input
              type="tel" name="phone"
              value={formData.phone} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nationalité</label>
            <input
              type="text" name="nationality"
              value={formData.nationality} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-xl border border-gray-100 w-full hover:bg-gray-100 transition-colors">
              <input
                type="checkbox" name="vip"
                checked={formData.vip} onChange={handleChange}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">Client VIP 🌟</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type Pièce ID</label>
            <select
              name="documentType"
              value={formData.documentType} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="PASSPORT">Passeport</option>
              <option value="ID_CARD">Carte d'Identité</option>
              <option value="DRIVERS_LICENSE">Permis de conduire</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">N° Pièce</label>
            <input
              type="text" name="documentNumber"
              value={formData.documentNumber} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Préférences / Notes</label>
          <textarea
            name="preferences" rows={2}
            value={formData.preferences} onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Oreiller ergonomique, allergie aux noix..."
          />
        </div>

        {err && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {err}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <GradientButton type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Création...' : 'Créer le client'}
          </GradientButton>
        </div>
      </form>
    </Modal>
  );
}
