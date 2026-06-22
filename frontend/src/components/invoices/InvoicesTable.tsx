'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { type Invoice, formatMoney } from '@/lib/api-client';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { isInvoiceOverdue } from '@/lib/billing-helpers';

export function InvoicesTable({ invoices, locale = 'fr' }: { invoices: Invoice[]; locale?: string }) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📄</p>
        <p className="text-sm font-medium">Aucune facture</p>
      </div>
    );
  }

  const dateLocale = locale === 'fr' ? frLocale : undefined;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
            <th className="py-3 px-4">Référence</th>
            <th className="py-3 px-4">Client</th>
            <th className="py-3 px-4">Émise le</th>
            <th className="py-3 px-4">Échéance</th>
            <th className="py-3 px-4 text-right">Total</th>
            <th className="py-3 px-4 text-right">Payé</th>
            <th className="py-3 px-4 text-right">Restant</th>
            <th className="py-3 px-4">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {invoices.map((inv) => {
            const paid      = inv.paidCents ?? 0;
            const remaining = inv.totalCents - paid;
            const overdue   = isInvoiceOverdue(inv);

            return (
              <tr
                key={inv.id}
                className="hover:bg-white/70 transition-colors cursor-pointer"
              >
                <td className="py-3.5 px-4">
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="font-mono text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline"
                  >
                    {inv.reference}
                  </Link>
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-900">
                  {inv.guest.lastName} {inv.guest.firstName}
                </td>
                <td className="py-3.5 px-4 text-gray-500">
                  {inv.issuedAt
                    ? format(new Date(inv.issuedAt), 'dd MMM yyyy', { locale: dateLocale })
                    : '—'}
                </td>
                <td className="py-3.5 px-4 text-gray-500">
                  {inv.dueAt ? (
                    <span className={overdue ? 'text-red-600 font-medium' : ''}>
                      {format(new Date(inv.dueAt), 'dd MMM yyyy', { locale: dateLocale })}
                      {overdue && <span className="ml-1 text-xs">⚠</span>}
                    </span>
                  ) : '—'}
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-gray-900">
                  {formatMoney(inv.totalCents, inv.currency)}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-600 font-medium">
                  {formatMoney(paid, inv.currency)}
                </td>
                <td className={`py-3.5 px-4 text-right font-medium ${remaining > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formatMoney(remaining, inv.currency)}
                </td>
                <td className="py-3.5 px-4">
                  <InvoiceStatusBadge status={inv.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
