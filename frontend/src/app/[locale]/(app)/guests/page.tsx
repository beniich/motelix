'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Star, User, MoreVertical, Mail, Phone, FileText } from 'lucide-react';
import { guestsApi, type Guest } from '@/lib/api-client';
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

  const openNewGuest = () => { setSelectedGuest(null); setModalOpen(true); };
  const handleEdit = (guest: Guest) => { setSelectedGuest(guest); setModalOpen(true); };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-4 text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-gray-900">Clients (Guests)</h1>
          <p className="text-gray-500 mt-1 text-sm">{data?.pagination.total ?? 0} client(s) enregistré(s)</p>
        </div>
        <button
          onClick={openNewGuest}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #0a66c2, #2563eb)', boxShadow: '0 4px 16px rgba(10,102,194,0.3)' }}
        >
          <Plus size={16} />
          Nouveau Client
        </button>
      </header>

      {/* Search & Table */}
      <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
        
        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Chargement des clients...</div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Aucun client trouvé.</div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Nom</th>
                    <th className="py-3 px-4 font-semibold">Contact</th>
                    <th className="py-3 px-4 font-semibold">Document</th>
                    <th className="py-3 px-4 font-semibold text-center">VIP</th>
                    <th className="py-3 px-4 font-semibold text-center">Réservations</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((guest) => (
                    <tr
                      key={guest.id}
                      className="border-b border-gray-50 hover:bg-white/60 transition-colors cursor-pointer"
                      onClick={() => handleEdit(guest)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0" style={{ background: 'rgba(10,102,194,0.1)' }}>
                            {guest.firstName?.[0]}{guest.lastName?.[0]}
                          </div>
                          <span className="font-medium text-gray-900">{guest.firstName} {guest.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                          <Mail size={12} className="text-gray-400" />
                          {guest.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
                          <Phone size={11} />
                          {guest.phone || '—'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                          <FileText size={12} className="text-gray-400" />
                          {guest.documentType ? `${guest.documentType}: ${guest.documentNumber}` : '—'}
                        </div>
                        <div className="text-gray-400 text-xs mt-0.5">{guest.nationality || '—'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {guest.vip && (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: 'rgba(212,175,55,0.12)' }}>
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-blue-700" style={{ background: 'rgba(10,102,194,0.08)' }}>
                          {guest._count?.reservations || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(guest); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
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
            <div className="flex items-center justify-between mt-6 px-2">
              <span className="text-sm text-gray-400">
                Page {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={!data.pagination.hasPrev}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-white/80 border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-blue-300 transition-all"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.pagination.hasNext}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-white/80 border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-blue-300 transition-all"
                >
                  Suivant
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {isModalOpen && (
        <GuestModal
          guest={selectedGuest}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
