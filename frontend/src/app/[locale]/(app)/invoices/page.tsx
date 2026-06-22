'use client';

import { useState } from 'react';
import { Plus, BarChart2, List, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { invoicesApi, type Invoice } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { InvoiceDetailModal } from '@/components/invoices/InvoiceDetailModal';
import { CreateInvoiceModal } from '@/components/invoices/CreateInvoiceModal';
import { InvoicesTable } from '@/components/invoices/InvoicesTable';
import { BillingStats } from '@/components/invoices/BillingStats';
import { RevenueChart } from '@/components/invoices/RevenueChart';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';

const STATUS_OPTIONS = [
  { value: '',               label: 'Tous statuts' },
  { value: 'ISSUED',         label: 'Émises' },
  { value: 'PARTIALLY_PAID', label: 'Partiellement payées' },
  { value: 'PAID',           label: 'Payées' },
  { value: 'OVERDUE',        label: 'En retard' },
  { value: 'CANCELLED',      label: 'Annulées' },
  { value: 'REFUNDED',       label: 'Remboursées' },
];

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [view, setView]         = useState<'list' | 'analytics'>('list');
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, page, setPage } = usePaginatedQuery<Invoice>(
    'invoices',
    (params) =>
      invoicesApi.list({
        ...params,
        ...(params.status ? { status: params.status as Invoice['status'] } : {}),
      }),
    statusFilter ? { status: statusFilter } : {},
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-gray-900">Facturation</h1>
          <p className="mt-1 text-sm text-gray-500">{data?.pagination.total ?? 0} facture(s)</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div
            className="flex rounded-xl overflow-hidden border border-gray-200 bg-white text-sm"
            role="group"
          >
            {([ 
              { id: 'list',      icon: List,      label: 'Liste' },
              { id: 'analytics', icon: BarChart2, label: 'Analytics' },
            ] as const).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 px-4 py-2 transition-colors ${
                  view === id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
          <GradientButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            Nouvelle facture
          </GradientButton>
        </div>
      </div>

      {/* KPI Stats – always visible */}
      <BillingStats />

      {view === 'list' ? (
        <GlassCard>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Référence, client…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
                disabled // search handled by backend via param; add debounce later
              />
            </div>
            <div className="sm:w-56">
              <Select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                options={STATUS_OPTIONS}
              />
            </div>
          </div>

          <InvoicesTable invoices={data?.items ?? []} />

          {data && (
            <div className="mt-5">
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </GlassCard>
      ) : (
        <RevenueChart />
      )}

      <InvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} />
      <CreateInvoiceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(i) => { setSelected(i); setCreateOpen(false); }}
      />
    </div>
  );
}
