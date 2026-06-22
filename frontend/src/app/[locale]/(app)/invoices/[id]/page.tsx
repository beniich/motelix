'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import {
  ArrowLeft, Download, Mail, DollarSign, RefreshCw, Ban,
  Send, AlertTriangle, CheckCircle, Clock, FileText,
} from 'lucide-react';
import { api, toApiError } from '@/lib/api';
import { formatMoney, type Invoice, type Payment, invoicesApi } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Badge } from '@/components/ui/Badge';
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge';
import { RecordPaymentModal } from '@/components/invoices/RecordPaymentModal';
import { RefundModal } from '@/components/invoices/RefundModal';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_CONFIG, isInvoiceOverdue } from '@/lib/billing-helpers';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [invoice, setInvoice]           = useState<Invoice | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [paymentOpen, setPaymentOpen]   = useState(false);
  const [refundPayment, setRefundPayment] = useState<Payment | null>(null);
  const [actioning, setActioning]       = useState(false);
  const [actionMsg, setActionMsg]       = useState('');

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const inv = await invoicesApi.get(id);
      setInvoice(inv);
    } catch (e) {
      setError(toApiError(e).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInvoice(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async (label: string, fn: () => Promise<void>) => {
    setActioning(true);
    setActionMsg('');
    try {
      await fn();
      setActionMsg(`✅ ${label} effectué`);
      await loadInvoice();
    } catch (e) {
      setActionMsg(`❌ ${toApiError(e).message}`);
    } finally {
      setActioning(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open(invoicesApi.pdfUrl(id), '_blank');
  };

  const handleSendEmail = () =>
    handleAction('Envoi email', async () => {
      await api.post(`/api/invoices/${id}/send`);
    });

  const handleIssue = () =>
    handleAction('Émission', async () => {
      await api.post(`/api/invoices/${id}/issue`);
    });

  const handleVoid = () => {
    if (!confirm(`Annuler définitivement la facture ${invoice?.reference} ?`)) return;
    handleAction('Annulation', async () => {
      await api.post(`/api/invoices/${id}/void`, { reason: 'Annulation manuelle' });
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-20 text-red-500 space-y-3">
        <AlertTriangle className="w-10 h-10 mx-auto" />
        <p className="font-medium">{error || 'Facture introuvable'}</p>
        <Link href="/invoices" className="text-sm text-blue-600 hover:underline">← Retour aux factures</Link>
      </div>
    );
  }

  const paid        = invoice.paidCents ?? 0;
  const remaining   = invoice.totalCents - paid;
  const overdue     = isInvoiceOverdue(invoice);
  const lineItems   = invoice.lineItems ?? [];
  const payments    = invoice.payments ?? [];
  const currency    = invoice.currency;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb + actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900 font-mono">{invoice.reference}</h1>
              <InvoiceStatusBadge status={invoice.status} />
              {overdue && <Badge variant="danger">⚠ En retard</Badge>}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {invoice.guest.firstName} {invoice.guest.lastName} · {invoice.guest.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {invoice.status === 'DRAFT' && (
            <GradientButton
              leftIcon={<Send className="w-4 h-4" />}
              onClick={handleIssue}
              disabled={actioning}
            >
              Émettre
            </GradientButton>
          )}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleSendEmail}
            disabled={actioning}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors disabled:opacity-60"
          >
            <Mail className="w-4 h-4" />
            Envoyer
          </button>
          {remaining > 0 && !['CANCELLED'].includes(invoice.status) && (
            <GradientButton
              leftIcon={<DollarSign className="w-4 h-4" />}
              onClick={() => setPaymentOpen(true)}
            >
              Paiement
            </GradientButton>
          )}
          {invoice.status !== 'CANCELLED' && paid === 0 && (
            <button
              onClick={handleVoid}
              disabled={actioning}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors disabled:opacity-60"
            >
              <Ban className="w-4 h-4" />
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* Action feedback */}
      {actionMsg && (
        <div className={`text-sm px-4 py-2 rounded-xl border ${
          actionMsg.startsWith('✅')
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {actionMsg}
        </div>
      )}

      {/* KPI summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total TTC',    value: formatMoney(invoice.totalCents, currency), color: 'text-gray-900' },
          { label: 'Payé',         value: formatMoney(paid, currency),               color: 'text-emerald-600' },
          { label: 'Restant dû',   value: formatMoney(remaining, currency),          color: remaining > 0 ? 'text-red-500' : 'text-gray-400' },
          { label: 'TVA',          value: formatMoney(invoice.taxCents, currency),   color: 'text-gray-600' },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {[
          { label: 'Réservation',  value: invoice.reservation.reference },
          { label: 'Chambre',      value: invoice.reservation.room?.number ?? '—' },
          { label: 'Émise le',     value: invoice.issuedAt ? format(new Date(invoice.issuedAt), 'dd MMM yyyy', { locale: frLocale }) : '—' },
          { label: 'Échéance',     value: invoice.dueAt   ? format(new Date(invoice.dueAt),    'dd MMM yyyy', { locale: frLocale }) : '—' },
        ].map((m) => (
          <div key={m.label}>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{m.label}</p>
            <p className="font-medium text-gray-800 mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Line items */}
      <GlassCard>
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          Détail des lignes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 px-4 text-right">Qté</th>
                <th className="pb-2 px-4 text-right">Prix unit. HT</th>
                <th className="pb-2 px-4 text-right">TVA</th>
                <th className="pb-2 pl-4 text-right">Total TTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lineItems.map((li: any, i: number) => (
                <tr key={li.id ?? i}>
                  <td className="py-3 pr-4 text-gray-900">{li.description}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{li.quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{formatMoney(li.unitPriceCents, currency)}</td>
                  <td className="py-3 px-4 text-right text-gray-500">{((li.taxRate ?? 0) * 100).toFixed(1)}%</td>
                  <td className="py-3 pl-4 text-right font-semibold text-gray-900">{formatMoney(li.totalCents, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Sous-total HT</span>
              <span>{formatMoney(invoice.subtotalCents, currency)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>TVA</span>
              <span>{formatMoney(invoice.taxCents, currency)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 text-base">
              <span>Total TTC</span>
              <span>{formatMoney(invoice.totalCents, currency)}</span>
            </div>
            {paid > 0 && (
              <>
                <div className="flex justify-between text-emerald-600">
                  <span>Payé</span>
                  <span>−{formatMoney(paid, currency)}</span>
                </div>
                <div className={`flex justify-between font-bold border-t border-gray-200 pt-2 ${remaining > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  <span>Restant dû</span>
                  <span>{formatMoney(remaining, currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Payments history */}
      <GlassCard>
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          Paiements ({payments.length})
        </h2>

        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun paiement enregistré</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 px-4 text-right">Montant</th>
                  <th className="pb-2 px-4">Méthode</th>
                  <th className="pb-2 px-4">Statut</th>
                  <th className="pb-2 px-4">Référence</th>
                  <th className="pb-2 pl-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => {
                  const statusCfg = PAYMENT_STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id}>
                      <td className="py-3 pr-4 text-gray-600">
                        {p.paidAt
                          ? format(new Date(p.paidAt), 'dd MMM yyyy HH:mm', { locale: frLocale })
                          : <span className="text-amber-500 text-xs">En attente</span>}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        {formatMoney(p.amountCents, currency)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {PAYMENT_METHOD_LABELS[p.method]}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusCfg?.variant ?? 'default'}>{statusCfg?.label ?? p.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs font-mono">{p.reference ?? '—'}</td>
                      <td className="py-3 pl-4">
                        {p.status === 'SUCCEEDED' && (
                          <button
                            onClick={() => setRefundPayment(p)}
                            className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 hover:underline"
                            title="Rembourser"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Rembourser
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Notes */}
      {invoice.notes && (
        <GlassCard>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Notes</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
        </GlassCard>
      )}

      {/* Modals */}
      <RecordPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        invoice={invoice}
        onSuccess={loadInvoice}
      />

      {refundPayment && (
        <RefundModal
          open={!!refundPayment}
          onClose={() => setRefundPayment(null)}
          invoice={invoice}
          payment={refundPayment}
          onSuccess={() => { setRefundPayment(null); loadInvoice(); }}
        />
      )}
    </div>
  );
}
