import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Loader2, AlertCircle, RefreshCw, X, CreditCard, FileText, LayoutDashboard, Calendar, PieChart } from 'lucide-react';
import { useInvoices, useIssueInvoice, useRecordPayment, formatMoney, type Invoice } from '@/hooks/useInvoices';

// ─── Status helpers ────────────────────────────────────────────────────────────

function statusBadge(status: Invoice['status']) {
  const map: Record<string, { label: string; color: string }> = {
    DRAFT:          { label: 'BROUILLON', color: '#94a3b8' },
    ISSUED:         { label: 'OUVERT',    color: '#94a3b8' },
    PAID:           { label: 'PAYÉ',      color: '#4ade80' },
    PARTIALLY_PAID: { label: 'PARTIEL',   color: '#f59e0b' },
    OVERDUE:        { label: 'EN RETARD', color: '#f87171' },
    CANCELLED:      { label: 'ANNULÉ',    color: '#ef4444' },
    REFUNDED:       { label: 'REMBOURSÉ', color: '#a78bfa' },
  };
  return map[status] ?? { label: status, color: '#94a3b8' };
}

// ─── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({ title, value, loading }: { title: string; value: string | number; loading?: boolean }) {
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden group shadow-sm border"
      style={{ backgroundColor: 'rgba(45,50,60,0.4)', borderColor: 'rgba(56,62,74,0.6)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <h3 className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: '#94a3b8' }}>{title}</h3>
      {loading
        ? <div className="h-8 w-24 rounded bg-white/10 animate-pulse" />
        : <p className="text-3xl font-light text-white tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
      }
    </div>
  );
}

// ─── Pay modal ────────────────────────────────────────────────────────────────

function PayModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const [amount, setAmount] = useState(String((invoice.totalCents - invoice.paidCents) / 100));
  const [method, setMethod] = useState('CARD');
  const recordPayment = useRecordPayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordPayment.mutate({
      id: invoice.id,
      data: { amountCents: Math.round(parseFloat(amount) * 100), method },
    }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="rounded-2xl p-6 w-full max-w-sm shadow-2xl border"
        style={{ backgroundColor: '#2d3240', borderColor: '#383e4a', color: '#e2e8f0' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Enregistrer un paiement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
          Facture <strong className="text-white">{invoice.reference}</strong> — {invoice.guest.firstName} {invoice.guest.lastName}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider block mb-1" style={{ color: '#94a3b8' }}>Montant (€)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none border"
              style={{ backgroundColor: '#1e2535', borderColor: '#383e4a', color: '#e2e8f0' }}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider block mb-1" style={{ color: '#94a3b8' }}>Méthode</label>
            <select
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none border"
              style={{ backgroundColor: '#1e2535', borderColor: '#383e4a', color: '#e2e8f0' }}
            >
              <option value="CARD">Carte bancaire</option>
              <option value="CASH">Espèces</option>
              <option value="TRANSFER">Virement</option>
              <option value="CHECK">Chèque</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm border" style={{ borderColor: '#383e4a', color: '#94a3b8' }}>Annuler</button>
            <button
              type="submit"
              disabled={recordPayment.isPending}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-black flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#e6c875 0%,#b8923a 100%)' }}
            >
              {recordPayment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function BillingDashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  const { data, isLoading, isError, refetch } = useInvoices({ status: statusFilter || undefined, page });
  const issueInvoice = useIssueInvoice();

  const invoices = data?.items ?? [];
  const pagination = data?.pagination;

  // Compute metrics from current page data
  const metrics = useMemo(() => {
    const all = invoices;
    const totalRev = all.reduce((s, i) => s + i.paidCents, 0) / 100;
    const outstanding = all.filter(i => ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'].includes(i.status));
    const outstandingAmt = outstanding.reduce((s, i) => s + (i.totalCents - i.paidCents), 0) / 100;
    const pending = all.filter(i => i.status === 'DRAFT').length;
    return { totalRev, outstandingCount: outstanding.length, outstandingAmt, pending };
  }, [invoices]);

  // Client-side search on current page
  const filtered = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(
      i =>
        i.reference.toLowerCase().includes(q) ||
        `${i.guest.firstName} ${i.guest.lastName}`.toLowerCase().includes(q)
    );
  }, [invoices, search]);

  // Recent sidebar: last 3 paid
  const recent = useMemo(() =>
    [...invoices].filter(i => i.status === 'PAID').slice(0, 3),
    [invoices]
  );

  const tabs = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Calendar, label: 'Réservations' },
    { icon: FileText, label: 'Folios', active: true },
    { icon: CreditCard, label: 'Paiements' },
    { icon: PieChart, label: 'Rapports' },
  ];

  return (
    <div
      className="w-full h-full min-h-screen flex items-center justify-center p-4 antialiased"
      style={{ backgroundColor: '#16181d', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .billing-scrollbar::-webkit-scrollbar { width: 6px; }
        .billing-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .billing-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 20px; }
        .tr-hover:hover { background: rgba(255,255,255,0.03); }
      `}</style>

      {payingInvoice && <PayModal invoice={payingInvoice} onClose={() => setPayingInvoice(null)} />}

      <div
        className="w-full max-w-[1376px] h-[768px] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl border"
        style={{ background: 'linear-gradient(180deg,rgba(36,40,49,0.8),rgba(36,40,49,0.4))', backdropFilter: 'blur(12px)', borderColor: '#383e4a' }}
      >
        {/* Top gradient */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />

        {/* Nav */}
        <header className="flex items-center justify-between px-6 py-4 border-b relative z-10" style={{ borderColor: 'rgba(56,62,74,0.5)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-slate-900 font-bold text-xl">Z</div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight tracking-wide">Zafir</h1>
              <p className="text-xs font-medium tracking-wider uppercase" style={{ color: '#94a3b8' }}>Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Chercher folio, client..."
                className="text-sm rounded-lg pl-9 pr-4 py-2 w-72 focus:outline-none border"
                style={{ backgroundColor: 'rgba(45,50,60,0.5)', borderColor: '#383e4a', color: '#e2e8f0' }}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col p-6 overflow-hidden z-10">
          {/* Tabs */}
          <div className="mb-6">
            <h2 className="text-3xl font-light text-white mb-6 tracking-wide">Billing & Folios</h2>
            <nav className="flex border-b" style={{ borderColor: 'rgba(56,62,74,0.6)' }}>
              {tabs.map(({ icon: Icon, label, active }) => (
                <button
                  key={label}
                  className="px-5 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 relative"
                  style={{ color: active ? '#fff' : '#94a3b8', borderBottom: active ? '2px solid #cbd5e1' : '2px solid transparent' }}
                >
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </nav>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <MetricCard title="Revenu Encaissé" value={`€${metrics.totalRev.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`} loading={isLoading} />
            <MetricCard title="Folios Ouverts" value={`${metrics.outstandingCount} (€${metrics.outstandingAmt.toFixed(0)})`} loading={isLoading} />
            <MetricCard title="Brouillons" value={metrics.pending} loading={isLoading} />
            <MetricCard title="Total Folios" value={pagination?.total ?? 0} loading={isLoading} />
          </div>

          {/* Status filter chips */}
          <div className="flex gap-2 mb-4">
            {[
              { v: '', l: 'Tous' },
              { v: 'ISSUED', l: 'Ouverts' },
              { v: 'PAID', l: 'Payés' },
              { v: 'OVERDUE', l: 'En retard' },
              { v: 'DRAFT', l: 'Brouillons' },
            ].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => { setStatusFilter(v); setPage(1); }}
                className="px-3 py-1 text-xs rounded-full border transition-colors"
                style={{
                  borderColor: statusFilter === v ? '#e6c875' : '#383e4a',
                  color: statusFilter === v ? '#e6c875' : '#94a3b8',
                  backgroundColor: statusFilter === v ? 'rgba(230,200,117,0.1)' : 'transparent',
                }}
              >
                {l}
              </button>
            ))}
            <button onClick={() => refetch()} className="ml-auto flex items-center gap-1 px-3 py-1 text-xs rounded-full border" style={{ borderColor: '#383e4a', color: '#94a3b8' }}>
              <RefreshCw className="w-3 h-3" /> Actualiser
            </button>
          </div>

          {/* Table + sidebar */}
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Table */}
            <div
              className="flex-1 rounded-xl flex flex-col overflow-hidden relative shadow-md border"
              style={{ backgroundColor: 'rgba(45,50,60,0.3)', borderColor: 'rgba(56,62,74,0.5)' }}
            >
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(56,62,74,0.4)' }}>
                <h3 className="text-lg font-medium text-white">Ledger Actif</h3>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
              </div>

              {isError ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-red-400">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-sm">Erreur de chargement</p>
                  <button onClick={() => refetch()} className="text-xs border border-red-400/40 px-3 py-1.5 rounded-lg hover:bg-red-500/10 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Réessayer
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-auto billing-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase sticky top-0 backdrop-blur-md" style={{ color: '#94a3b8', backgroundColor: 'rgba(36,40,49,0.5)' }}>
                      <tr>
                        {['Référence', 'Client', 'Check-in', 'Check-out', 'Total', 'Statut', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 font-medium" scope="col">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 && !isLoading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: '#94a3b8' }}>
                            Aucun folio trouvé
                          </td>
                        </tr>
                      ) : (
                        filtered.map((inv) => {
                          const badge = statusBadge(inv.status);
                          const isOpen = ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE', 'DRAFT'].includes(inv.status);
                          return (
                            <tr key={inv.id} className="tr-hover border-b border-white/5 transition-all">
                              <td className="px-4 py-3 text-white text-xs font-mono">{inv.reference}</td>
                              <td className="px-4 py-3 text-white">{inv.guest.firstName} {inv.guest.lastName}</td>
                              <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>
                                {inv.reservation?.checkIn ? new Date(inv.reservation.checkIn).toLocaleDateString('fr-FR') : '—'}
                              </td>
                              <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>
                                {inv.reservation?.checkOut ? new Date(inv.reservation.checkOut).toLocaleDateString('fr-FR') : '—'}
                              </td>
                              <td className="px-4 py-3 text-white text-sm font-mono">
                                {formatMoney(inv.totalCents, inv.currency)}
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-xs font-semibold" style={{ color: badge.color }}>{badge.label}</span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {inv.status === 'DRAFT' && (
                                    <button
                                      onClick={() => issueInvoice.mutate(inv.id)}
                                      disabled={issueInvoice.isPending}
                                      className="px-2 py-1 text-xs font-medium text-white border rounded transition-colors"
                                      style={{ borderColor: '#383e4a' }}
                                    >
                                      Émettre
                                    </button>
                                  )}
                                  {isOpen && inv.status !== 'DRAFT' && (
                                    <button
                                      onClick={() => setPayingInvoice(inv)}
                                      className="px-2 py-1 text-xs font-semibold text-slate-900 rounded"
                                      style={{ background: 'linear-gradient(to bottom,#e2e8f0,#cbd5e1)' }}
                                    >
                                      Régler
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t text-sm" style={{ borderColor: 'rgba(56,62,74,0.4)' }}>
                  <span style={{ color: '#94a3b8' }}>Page {pagination.page} / {pagination.totalPages} — {pagination.total} résultats</span>
                  <div className="flex gap-2">
                    <button
                      disabled={!pagination.hasPrev}
                      onClick={() => setPage(p => p - 1)}
                      className="px-3 py-1 rounded border text-xs disabled:opacity-30"
                      style={{ borderColor: '#383e4a', color: '#e2e8f0' }}
                    >← Préc.</button>
                    <button
                      disabled={!pagination.hasNext}
                      onClick={() => setPage(p => p + 1)}
                      className="px-3 py-1 rounded border text-xs disabled:opacity-30"
                      style={{ borderColor: '#383e4a', color: '#e2e8f0' }}
                    >Suiv. →</button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent transactions sidebar */}
            <aside
              className="w-[260px] shrink-0 rounded-xl overflow-hidden shadow-md flex flex-col border"
              style={{ backgroundColor: 'rgba(45,50,60,0.3)', borderColor: 'rgba(56,62,74,0.5)' }}
            >
              <div className="p-5 border-b" style={{ borderColor: 'rgba(56,62,74,0.4)' }}>
                <h3 className="text-lg font-medium text-white">Payés récemment</h3>
              </div>
              <div className="flex-1 overflow-y-auto billing-scrollbar p-5 space-y-5">
                {recent.length === 0 ? (
                  <p className="text-xs text-center" style={{ color: '#94a3b8' }}>Aucun paiement récent</p>
                ) : recent.map(inv => (
                  <div key={inv.id} className="group">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94a3b8' }}>
                      {inv.guest.firstName} {inv.guest.lastName}
                    </p>
                    <div className="flex justify-between items-end">
                      <span className="text-lg text-white font-mono tracking-tight">
                        {formatMoney(inv.paidCents, inv.currency)}
                      </span>
                      <span className="text-xs" style={{ color: '#94a3b8' }}>{inv.reference}</span>
                    </div>
                    <div className="h-px mt-4" style={{ backgroundColor: 'rgba(56,62,74,0.3)' }} />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
