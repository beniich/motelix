import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';

export type Invoice = {
  id: string;
  reference: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  paidCents: number;
  currency: string;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  guest: { id: string; firstName: string; lastName: string; email: string };
  reservation: { id: string; reference: string; checkIn: string; checkOut: string };
};

export const formatMoney = (cents: number, currency = 'EUR') =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency, minimumFractionDigits: 2 }).format(cents / 100);

export function useInvoices(filters: { status?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => api.get<{ items: Invoice[]; pagination: any }>('/invoices', filters),
    placeholderData: (prev) => prev,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => api.get<{ invoice: Invoice & { lineItems: any[]; payments: any[] } }>(`/invoices/${id}`).then(r => r.invoice),
    enabled: !!id,
  });
}

export function useIssueInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post<{ invoice: Invoice }>(`/invoices/${id}/issue`).then(r => r.invoice),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { amountCents: number; method: string; reference?: string } }) =>
      api.post<{ invoice: Invoice }>(`/invoices/${id}/payments`, data).then(r => r.invoice),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (id: string) => api.post<{ url: string }>(`/invoices/${id}/checkout`).then(r => r.url),
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: () => api.post<{ url: string }>('/billing/portal').then(r => r.url),
  });
}
