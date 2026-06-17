'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileDown, CreditCard, Send, X, Check, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr as frLocale, enUS as enLocale } from 'date-fns/locale';
import { invoicesApi, type Invoice, formatMoney } from '@/lib/api-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Badge } from '@/components/ui/Badge';
import { useTranslations } from 'next-intl';

export function InvoiceDetailModal({ invoice, onClose }: { invoice: Invoice | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const [isIssuing, setIsIssuing] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const issueMutation = useMutation({
    mutationFn: (id: string) => invoicesApi.issue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (id: string) => invoicesApi.createCheckout(id),
    onSuccess: (data: any) => {
      window.location.href = data.url;
    },
  });

  if (!invoice) return null;

  const locale = invoice.language === 'fr' ? frLocale : enLocale;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Facture {invoice.reference}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pour {invoice.guest.firstName} {invoice.guest.lastName}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex gap-4">
            <GlassCard className="flex-1 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Montant Total</div>
              <div className="text-2xl font-bold text-amber-500">{formatMoney(invoice.totalCents, invoice.currency)}</div>
              <div className="text-sm text-gray-500 mt-1">Dont {formatMoney(invoice.taxCents, invoice.currency)} de TVA</div>
            </GlassCard>
            
            <GlassCard className="flex-1 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reste à payer</div>
              <div className="text-2xl font-bold text-emerald-600">{formatMoney(invoice.totalCents - invoice.paidCents, invoice.currency)}</div>
              <div className="text-sm text-gray-500 mt-1">Déjà payé : {formatMoney(invoice.paidCents, invoice.currency)}</div>
            </GlassCard>
            
            <GlassCard className="flex-1 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Statut</div>
              <div className="mt-2">
                <Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'ISSUED' ? 'info' : 'default'}>
                  {invoice.status}
                </Badge>
              </div>
              {invoice.dueAt && (
                <div className="text-sm text-gray-500 mt-2">
                  Échéance : {format(new Date(invoice.dueAt), 'dd MMM yyyy', { locale })}
                </div>
              )}
            </GlassCard>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Détail des lignes</h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500">
                    <th className="py-2 px-4 font-medium">Description</th>
                    <th className="py-2 px-4 font-medium text-right">Qté</th>
                    <th className="py-2 px-4 font-medium text-right">Prix unit.</th>
                    <th className="py-2 px-4 font-medium text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.lineItems?.map((li: any) => (
                    <tr key={li.id}>
                      <td className="py-3 px-4 text-gray-900">{li.description}</td>
                      <td className="py-3 px-4 text-gray-900 text-right">{li.quantity}</td>
                      <td className="py-3 px-4 text-gray-900 text-right">{formatMoney(li.unitPriceCents, invoice.currency)}</td>
                      <td className="py-3 px-4 text-gray-900 text-right font-medium">{formatMoney(li.totalCents, invoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
          <div className="flex gap-3">
            {invoice.status === 'DRAFT' && (
              <GradientButton
                leftIcon={<Send className="w-4 h-4" />}
                onClick={() => issueMutation.mutate(invoice.id)}
                disabled={issueMutation.isPending}
              >
                {issueMutation.isPending ? 'Émission...' : 'Émettre la facture'}
              </GradientButton>
            )}
            
            <button
              onClick={() => window.open(invoicesApi.pdfUrl(invoice.id), '_blank')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
            >
              <FileDown className="w-4 h-4 text-blue-600" />
              Télécharger PDF
            </button>
          </div>

          <div className="flex gap-3">
            {['ISSUED', 'PARTIALLY_PAID'].includes(invoice.status) && (
              <GradientButton
                leftIcon={<CreditCard className="w-4 h-4" />}
                onClick={() => checkoutMutation.mutate(invoice.id)}
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? 'Redirection...' : 'Payer via Stripe'}
              </GradientButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
