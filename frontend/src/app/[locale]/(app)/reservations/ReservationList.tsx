'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreVertical, CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react';
import { reservationsApi, type Reservation } from '@/lib/api-client';

export default function ReservationList({ onEdit }: { onEdit: (res: Reservation) => void }) {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery({
    queryKey: ['reservations', 'list', page],
    queryFn: () => reservationsApi.list({ page, pageSize: 15 }),
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Chargement des réservations...</div>;
  }

  if (!data || data.items.length === 0) {
    return <div className="p-8 text-center text-slate-400">Aucune réservation trouvée.</div>;
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-blue-500/20 text-blue-400';
      case 'CHECKED_IN': return 'bg-emerald-500/20 text-emerald-400';
      case 'CHECKED_OUT': return 'bg-slate-500/20 text-slate-400';
      case 'CANCELLED': return 'bg-rose-500/20 text-rose-400';
      default: return 'bg-amber-500/20 text-amber-400'; // PENDING
    }
  };

  const getPaymentColor = (status: string) => {
    switch(status) {
      case 'PAID': return 'text-emerald-400';
      case 'PARTIAL': return 'text-amber-400';
      case 'REFUNDED': return 'text-slate-400';
      default: return 'text-rose-400'; // PENDING
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="py-4 px-4 font-medium">Client</th>
              <th className="py-4 px-4 font-medium">Chambre</th>
              <th className="py-4 px-4 font-medium">Arrivée</th>
              <th className="py-4 px-4 font-medium">Départ</th>
              <th className="py-4 px-4 font-medium">Statut</th>
              <th className="py-4 px-4 font-medium">Paiement</th>
              <th className="py-4 px-4 font-medium text-right">Montant</th>
              <th className="py-4 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((res) => (
              <tr key={res.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{res.guest?.firstName} {res.guest?.lastName}</div>
                  <div className="text-xs text-slate-500">{res.guest?.email}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-[#D4AF37] font-semibold text-xs border border-[#D4AF37]/20">
                    {res.room?.number}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {format(new Date(res.checkIn), 'dd MMM yyyy', { locale: fr })}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {format(new Date(res.checkOut), 'dd MMM yyyy', { locale: fr })}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(res.status)}`}>
                    {res.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <CreditCard size={14} className={getPaymentColor(res.paymentStatus)} />
                    <span className="text-xs text-slate-400">{res.paymentStatus}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-medium text-white">
                  {res.totalPrice.toFixed(2)} €
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => onEdit(res)}
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
    </div>
  );
}
