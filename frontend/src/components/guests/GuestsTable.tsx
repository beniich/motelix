'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { Mail, Phone, MapPin, Award } from 'lucide-react';
import { type Guest } from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';

interface GuestsTableProps {
  guests: Guest[];
  locale?: string;
}

export function GuestsTable({ guests, locale = 'fr' }: GuestsTableProps) {
  if (guests.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🧑‍💼</p>
        <p className="text-sm font-medium">Aucun client trouvé</p>
      </div>
    );
  }

  const dateLocale = locale === 'fr' ? frLocale : undefined;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100 bg-gray-50/50">
            <th className="py-3 px-4 font-medium">Nom</th>
            <th className="py-3 px-4 font-medium">Contact</th>
            <th className="py-3 px-4 font-medium">Nationalité</th>
            <th className="py-3 px-4 font-medium text-center">Réservations</th>
            <th className="py-3 px-4 font-medium">Créé le</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {guests.map((g) => (
            <tr key={g.id} className="hover:bg-white/70 transition-colors group">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">
                    {g.firstName[0]}{g.lastName[0]}
                  </div>
                  <div>
                    <Link
                      href={`/guests/${g.id}`}
                      className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors"
                    >
                      {g.lastName} {g.firstName}
                    </Link>
                    {g.vip && (
                      <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">
                        <Award className="w-3 h-3" />
                        VIP
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4 space-y-1">
                <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {g.email}
                </div>
                {g.phone && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {g.phone}
                  </div>
                )}
              </td>
              <td className="py-3.5 px-4 text-gray-600 text-sm">
                {g.nationality ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {g.nationality}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="py-3.5 px-4 text-center">
                <Badge variant={g._count?.reservations ? 'info' : 'default'}>
                  {g._count?.reservations ?? 0}
                </Badge>
              </td>
              <td className="py-3.5 px-4 text-gray-500 text-sm">
                {format(new Date(g.createdAt), 'dd MMM yyyy', { locale: dateLocale })}
              </td>
              <td className="py-3.5 px-4 text-right">
                <Link
                  href={`/guests/${g.id}`}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline px-2 py-1 rounded transition-colors"
                >
                  Voir profil
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
