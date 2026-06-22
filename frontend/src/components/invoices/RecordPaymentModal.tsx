'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Banknote, Building2, FileText, MoreHorizontal, X, AlertCircle } from 'lucide-react';
import { api, toApiError } from '@/lib/api';
import { formatMoney, type Invoice, type Payment } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';

const METHODS: { value: Payment['method']; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'CARD',          label: 'Carte bancaire', icon: CreditCard, desc: 'Paiement par carte (Stripe)' },
  { value: 'CASH',          label: 'Espèces',        icon: Banknote,   desc: 'Paiement en cash à la réception' },
  { value: 'BANK_TRANSFER', label: 'Virement',       icon: Building2,  desc: 'Virement bancaire' },
  { value: 'CHECK',         label: 'Chèque',         icon: FileText,   desc: 'Paiement par chèque' },
  { value: 'OTHER',         label: 'Autre',          icon: MoreHorizontal, desc: 'Autre mode de paiement' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  onSuccess: () => void;
}

export function RecordPaymentModal({ open, onClose, invoice, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const remainingCents = invoice.totalCents - invoice.paidCents;

  const [method, setMethod] = useState<Payment['method']>('CARD');
  const [type, setType]     = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState(remainingCents);
  const [reference, setReference] = useState('');
  const [notes, setNotes]   = useState('');
  const [err, setErr]       = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      api.post<{ invoice: Invoice; payment: Payment }>(`/api/invoices/${invoice.id}/payments`, {
        amountCents: type === 'full' ? remainingCents : amount,
        method,
        reference: reference || undefined,
        notes: notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onSuccess();
      onClose();
    },
    onError: (e) => setErr(toApiError(e).message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (type === 'partial' && (amount <= 0 || amount > remainingCents)) {
      setErr(`Le montant doit être entre 1 et ${formatMoney(remainingCents, invoice.currency)}`);
      return;
    }
    mutation.mutate();
  };

  const selectedMethod = METHODS.find((m) => m.value === method)!;

  return (
    <Modal open={open} onClose={onClose} title={`Paiement — ${invoice.reference}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Total facture',  value: formatMoney(invoice.totalCents,   invoice.currency), color: 'text-gray-900' },
            { label: 'Déjà payé',      value: formatMoney(invoice.paidCents,    invoice.currency), color: 'text-emerald-600' },
            { label: 'Restant dû',     value: formatMoney(remainingCents,       invoice.currency), color: 'text-amber-600 font-bold' },
          ].map((s) => (
            <GlassCard key={s.label} className="p-3">
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className={`text-sm font-semibold ${s.color}`}>{s.value}</div>
            </GlassCard>
          ))}
        </div>

        {/* Payment type */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Type de paiement</label>
          <div className="flex gap-2">
            {(['full', 'partial'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); if (t === 'full') setAmount(remainingCents); }}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                  type === t
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === 'full' ? '✅ Intégral' : '🔢 Partiel'}
              </button>
            ))}
          </div>
        </div>

        {/* Amount (only for partial) */}
        {type === 'partial' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Montant (centimes) — max {formatMoney(remainingCents, invoice.currency)}
            </label>
            <input
              type="number"
              min={1}
              max={remainingCents}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              = {formatMoney(amount, invoice.currency)}
            </p>
          </div>
        )}

        {/* Payment method */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Mode de paiement</label>
          <div className="grid grid-cols-2 gap-2">
            {METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMethod(m.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm border transition-all ${
                    method === m.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{m.label}</span>
                </button>
              );
            })}
          </div>
          {method === 'CARD' && (
            <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              💳 <strong>Mode Mock Stripe actif</strong> — En production, Stripe Elements collectera les données de carte (PCI-DSS).
            </p>
          )}
        </div>

        {/* Reference (for CHECK / BANK_TRANSFER) */}
        {(method === 'CHECK' || method === 'BANK_TRANSFER') && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {method === 'CHECK' ? 'N° de chèque' : 'Référence virement'}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={method === 'CHECK' ? 'ex: 1234567' : 'ex: VIR-2025-001'}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optionnel)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {/* Error */}
        {err && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {err}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Encaissement :{' '}
            <span className="font-semibold text-gray-900">
              {formatMoney(type === 'full' ? remainingCents : amount, invoice.currency)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <GradientButton type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Enregistrement…' : '✅ Enregistrer'}
            </GradientButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}
