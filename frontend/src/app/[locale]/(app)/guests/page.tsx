'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Star, User, MoreVertical } from 'lucide-react';
import { guestsApi, type Guest } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import GuestModal from './GuestModal';

export default function GuestsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['guests', page, search],
    queryFn: () => guestsApi.list({ page, pageSize: 20, search }),
  });

  const openNewGuest = () => {
    setSelectedGuest(null);
    setModalOpen(true);
  };

  const handleEdit = (guest: Guest) => {
    setSelectedGuest(guest);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Clients (Guests)</h1>
        
        <button
          onClick={openNewGuest}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', color: '#0A0E27' }}
        >
          <Plus size={16} />
          Nouveau Client
        </button>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher un client (nom, email)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset page on search
              }}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Chargement des clients...</div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Aucun client trouvé.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-4 px-4 font-medium">Nom</th>
                    <th className="py-4 px-4 font-medium">Contact</th>
                    <th className="py-4 px-4 font-medium">Document</th>
                    <th className="py-4 px-4 font-medium text-center">VIP</th>
                    <th className="py-4 px-4 font-medium text-center">Réservations</th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((guest) => (
                    <tr key={guest.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[#D4AF37]">
                            <User size={14} />
                          </div>
                          {guest.firstName} {guest.lastName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-300">{guest.email}</div>
                        <div className="text-xs text-slate-500">{guest.phone || '—'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-300 text-xs">
                          {guest.documentType ? `${guest.documentType}: ${guest.documentNumber}` : '—'}
                        </div>
                        <div className="text-xs text-slate-500">{guest.nationality || '—'}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {guest.vip && (
                          <span className="inline-flex items-center justify-center p-1 rounded-md bg-amber-500/20 text-amber-400">
                            <Star size={14} className="fill-amber-400" />
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-medium border border-white/10">
                          {guest._count?.reservations || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => handleEdit(guest)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 px-4">
              <span className="text-sm text-slate-400">
                Page {data.pagination.page} sur {data.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={!data.pagination.hasPrev}
                  className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.pagination.hasNext}
                  className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  Suivant
                </button>
              </div>
            </div>
          </>
        )}
      </GlassCard>

      {isModalOpen && (
        <GuestModal
          guest={selectedGuest}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
