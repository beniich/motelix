'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  Archive,
  Building2,
  Users,
  BedDouble,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { useHotelContext } from '@/lib/hotelContext';
import { useRouter } from '@/i18n/routing';

type Hotel = {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  stars: number;
  _count?: { rooms: number; users: number; reservations: number; guests: number };
};

// ─── Create / Edit Modal ───────────────────────────────────────────────────────

function HotelModal({
  hotel,
  onClose,
}: {
  hotel: Hotel | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const isEditing = !!hotel;

  const [form, setForm] = useState({
    name: hotel?.name ?? '',
    address: hotel?.address ?? '',
    city: hotel?.city ?? '',
    country: hotel?.country ?? 'FR',
    stars: hotel?.stars ?? 5,
    // Initial admin fields (create only)
    createAdmin: false,
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
    adminPassword: '',
  });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        address: data.address,
        city: data.city,
        country: data.country.toUpperCase(),
        stars: data.stars,
      };
      if (!isEditing && data.createAdmin) {
        payload.initialAdmin = {
          email: data.adminEmail,
          firstName: data.adminFirstName,
          lastName: data.adminLastName,
          password: data.adminPassword,
        };
      }
      if (isEditing) {
        return api.patch(`/api/super/hotels/${hotel!.id}`, payload);
      }
      return api.post('/api/super/hotels', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super', 'hotels'] });
      qc.invalidateQueries({ queryKey: ['super', 'dashboard'] });
      onClose();
    },
  });

  const fieldCls =
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-amber-500 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(212,175,55,0.3)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
        >
          <div
            className="p-2 rounded-xl"
            style={{ background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}
          >
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? `Modifier : ${hotel!.name}` : 'Nouvel hôtel'}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {mutation.isError && (
            <div className="p-3 rounded-xl text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20">
              {(mutation.error as any)?.response?.data?.error ?? 'Une erreur est survenue'}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                Nom de l&apos;hôtel <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={fieldCls}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Adresse <span className="text-rose-500">*</span></label>
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={fieldCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Ville <span className="text-rose-500">*</span></label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={fieldCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Pays (ISO 2) <span className="text-rose-500">*</span></label>
              <input
                required
                maxLength={2}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase() })}
                className={fieldCls}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Catégorie</label>
              <select
                value={form.stars}
                onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}
                className={fieldCls}
                style={{ background: '#ffffff' }}
              >
                {[3, 4, 5].map((s) => (
                  <option key={s} value={s}>
                    {'⭐'.repeat(s)} — {s} étoiles
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Initial admin — only for creation */}
          {!isEditing && (
            <div
              className="pt-4 space-y-3"
              style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.createAdmin}
                  onChange={(e) => setForm({ ...form, createAdmin: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">
                  Créer un admin local en même temps
                </span>
              </label>

              {form.createAdmin && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500">Prénom</label>
                    <input
                      value={form.adminFirstName}
                      onChange={(e) => setForm({ ...form, adminFirstName: e.target.value })}
                      className={fieldCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500">Nom</label>
                    <input
                      value={form.adminLastName}
                      onChange={(e) => setForm({ ...form, adminLastName: e.target.value })}
                      className={fieldCls}
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs text-gray-500">Email admin</label>
                    <input
                      type="email"
                      value={form.adminEmail}
                      onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                      className={fieldCls}
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs text-gray-500">Mot de passe (min 8)</label>
                    <input
                      type="password"
                      minLength={8}
                      value={form.adminPassword}
                      onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                      className={fieldCls}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex justify-end gap-3"
          style={{ borderTop: '1px solid rgba(0,0,0,0.08)', background: '#f9fafb' }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.name || !form.address || !form.city}
            className="px-6 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: 'linear-gradient(135deg,#D4AF37 0%,#B8860B 100%)',
              color: '#0A0E27',
            }}
          >
            {mutation.isPending ? 'Enregistrement…' : isEditing ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuperHotelsPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const { setCurrentHotel } = useHotelContext();
  const [modalHotel, setModalHotel] = useState<Hotel | null | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['super', 'hotels'],
    queryFn: async () =>
      (await api.get<{ hotels: Hotel[] }>('/api/super/hotels')).data.hotels,
  });

  const archiveMut = useMutation({
    mutationFn: (id: string) => api.post(`/api/super/hotels/${id}/archive`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super', 'hotels'] });
      qc.invalidateQueries({ queryKey: ['super', 'dashboard'] });
    },
    onError: (e: any) => alert(e?.response?.data?.error ?? 'Erreur lors de l\'archivage'),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hôtels du groupe</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading ? '…' : `${data?.length ?? 0} hôtel(s) enregistré(s)`}
          </p>
        </div>
        <button
          onClick={() => setModalHotel(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(135deg,#D4AF37 0%,#B8860B 100%)',
            color: '#0A0E27',
          }}
        >
          <Plus className="w-4 h-4" />
          Nouvel hôtel
        </button>
      </div>

      {/* Hotel grid */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-500">Chargement…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.map((hotel) => (
            <GlassCard key={hotel.id} className="flex flex-col">
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setModalHotel(hotel)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Archiver "${hotel.name}" ? Cette action désactivera tous les utilisateurs de cet hôtel.`)) {
                        archiveMut.mutate(hotel.id);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors text-rose-400"
                    title="Archiver"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-semibold text-gray-900">{hotel.name}</h3>
              <p className="text-xs mt-0.5 mb-1 text-gray-500">
                {hotel.city}, {hotel.country}
              </p>
              <p className="text-sm mb-3">{'⭐'.repeat(hotel.stars)}</p>

              {/* Stats row */}
              <div
                className="grid grid-cols-3 gap-2 py-3 mt-auto"
                style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
              >
                {[
                  { icon: BedDouble, label: 'Chambres', val: hotel._count?.rooms ?? 0 },
                  { icon: Users, label: 'Users', val: hotel._count?.users ?? 0 },
                  { icon: CalendarDays, label: 'Résas', val: hotel._count?.reservations ?? 0 },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="text-center">
                    <p className="text-lg font-bold text-gray-900">{val}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pilot button */}
              <button
                onClick={() => {
                  setCurrentHotel(hotel);
                  router.push('/dashboard');
                }}
                className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium transition-colors hover:bg-amber-50"
                style={{ color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                Piloter cet hôtel
                <ArrowRight className="w-3 h-3" />
              </button>
            </GlassCard>
          ))}

          {/* Empty state */}
          {!isLoading && (!data || data.length === 0) && (
            <div className="col-span-3 text-center py-16 text-gray-500">
              Aucun hôtel configuré. Cliquez sur &quot;Nouvel hôtel&quot; pour commencer.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalHotel !== undefined && (
        <HotelModal hotel={modalHotel} onClose={() => setModalHotel(undefined)} />
      )}
    </div>
  );
}
