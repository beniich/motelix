import type { Invoice, Payment } from '@/lib/api-client';

export type InvoiceStatus = Invoice['status'];
export type PaymentMethod = Payment['method'];
export type PaymentStatus = Payment['status'];

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; variant: 'default' | 'info' | 'success' | 'warning' | 'danger' }> = {
  DRAFT:          { label: 'Brouillon',           variant: 'default' },
  ISSUED:         { label: 'Émise',               variant: 'info' },
  PARTIALLY_PAID: { label: 'Partiellement payée', variant: 'warning' },
  PAID:           { label: 'Payée',               variant: 'success' },
  OVERDUE:        { label: 'En retard',           variant: 'danger' },
  CANCELLED:      { label: 'Annulée',             variant: 'default' },
  REFUNDED:       { label: 'Remboursée',          variant: 'info' },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CARD:          'Carte',
  CASH:          'Espèces',
  BANK_TRANSFER: 'Virement',
  CHECK:         'Chèque',
  OTHER:         'Autre',
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  CARD:          '💳',
  CASH:          '💵',
  BANK_TRANSFER: '🏦',
  CHECK:         '📝',
  OTHER:         '📋',
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; variant: 'default' | 'info' | 'success' | 'warning' | 'danger' }> = {
  PENDING:   { label: 'En attente', variant: 'warning' },
  SUCCEEDED: { label: 'Réussi',     variant: 'success' },
  FAILED:    { label: 'Échoué',     variant: 'danger' },
  REFUNDED:  { label: 'Remboursé',  variant: 'info' },
};

export function formatPaymentMethod(method: PaymentMethod): string {
  return `${PAYMENT_METHOD_ICONS[method]} ${PAYMENT_METHOD_LABELS[method]}`;
}

/** Returns true if the invoice is past its due date and not settled. */
export function isInvoiceOverdue(invoice: Pick<Invoice, 'status' | 'dueAt'>): boolean {
  if (['PAID', 'CANCELLED', 'REFUNDED'].includes(invoice.status)) return false;
  if (!invoice.dueAt) return false;
  return new Date(invoice.dueAt) < new Date();
}
