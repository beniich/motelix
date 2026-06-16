'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, FileText, Euro, Eye, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { invoicesApi, type Invoice, formatMoney } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { InvoiceDetailModal } from '@/components/invoices/InvoiceDetailModal';
import { CreateInvoiceModal } from '@/components/invoices/CreateInvoiceModal';

const STATUS_LABELS: Record<string, { label: string; variant: any }> = {
  DRAFT:          { label: 'Brouillon',         variant: 'default' },
  ISSUED:         { label: 'Émise',             variant: 'info' },
  PAID:           { label: 'Payée',             variant: 'success' },
  PARTIALLY_PAID: { label: 'Partiellement',     variant: 'warning' },
  OVERDUE:        { label: 'En retard',         variant: 'danger' },
  CANCELLED:      { label: 'Annulée',           variant: 'default' },
  REFUNDED:       { label: 'Remboursée',        variant: 'info' },
};

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  
  const { data, page, setPage } = usePaginatedQuery<Invoice>(
    'invoices',
    (params) => invoicesApi.list({
      ...params,
      ...(statusFilter ? { status: statusFilter as any } : {}),
    })
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-midnight-50">Factures</h1>
          <p className="mt-1 text-sm text-midnight-200">{data?.pagination.total ?? 0} facture(s)</p>
        </div>
        <GradientButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
          Nouvelle facture
        </GradientButton>
      </div>
      
      <GlassCard>
        <div className="mb-4 max-w-xs">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous statuts' },
              ...Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-midnight-200 border-b border-white/10">
                <th className="py-3 px-2">Réf</th>
                <th className="py-3 px-2">Guest</th>
                <th className="py-3 px-2">Réf résa</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2">Payé</th>
                <th className="py-3 px-2">Statut</th>
                <th className="py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelected(inv)}
                  className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                >
                  <td className="py-3 px-2 font-mono text-xs text-gold-400">{inv.reference}</td>
                  <td className="py-3 px-2 text-midnight-50">{inv.guest.lastName} {inv.guest.firstName}</td>
                  <td className="py-3 px-2 text-midnight-200 font-mono text-xs">{inv.reservation.reference}</td>
                  <td className="py-3 px-2 text-midnight-50 font-semibold">{formatMoney(inv.totalCents, inv.currency)}</td>
                  <td className="py-3 px-2 text-emerald-300">{formatMoney(inv.paidCents, inv.currency)}</td>
                  <td className="py-3 px-2">
                    <Badge variant={STATUS_LABELS[inv.status]?.variant}>{STATUS_LABELS[inv.status]?.label}</Badge>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button className="text-xs text-sapphire-400">Voir →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
      </GlassCard>
      
      <InvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} />
      <CreateInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={(i) => { setSelected(i); setCreateOpen(false); }} />
    </div>
  );
}
