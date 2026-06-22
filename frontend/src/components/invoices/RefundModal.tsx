'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { api, toApiError } from '@/lib/api';
import { formatMoney, type Invoice, type Payment } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { GradientButton } from '@/components/ui/GradientButton';

const REFUND_REASONS = [
  { value: 'requested_by_customer', label: 'Demandé par le client' },
  { value: 'duplicate',             label: 'Doublon de paiement' },
  { value: 'fraudulent',            label: 'Fraude signalée' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  payment: Payment;
  onSuccess: () => void;
}

export function RefundModal({ open, onClose, invoice, payment, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [amount, setAmount]   = useState(payment.amountCents);
  const [reason, setReason]   = useState('requested_by_customer');
  const [notes, setNotes]     = useState('');
  const [err, setErr]         = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      api.post(`/api/payments/${payment.id}/refund`, {
        amountCents: amount,
        reason,
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
    if (amount <= 0 || amount > payment.amountCents) {
      setErr(`Le montant doit être entre 1 et ${formatMoney(payment.amountCents, invoice.currency)}`);
      return;
    }
    mutation.mutate();
  };

  return (
    <Modal open={open} onClose={onClose} title="Rembourser un paiement" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700 space-y-1">
          <p><strong>Facture :</strong> {invoice.reference}</p>
          <p><strong>Paiement original :</strong> {formatMoney(payment.amountCents, invoice.currency)}</p>
          <p><strong>Méthode :</strong> {payment.method}</p>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Montant à rembourser (centimes)
          </label>
          <input
            type="number"
            min={1}
            max={payment.amountCents}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <p className="text-xs text-gray-400 mt-1">= {formatMoney(amount, invoice.currency)}</p>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Raison</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {REFUND_REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Notes internes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        {payment.method === 'CARD' && (
          <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
            Le remboursement sera traité via <strong>Stripe</strong> et crédité sous 5-10 jours ouvrés.
          </p>
        )}

        {err && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {err}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors disabled:opacity-60"
          >
            {mutation.isPending ? 'Traitement…' : '↩ Confirmer le remboursement'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
