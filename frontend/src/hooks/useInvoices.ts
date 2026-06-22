'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, toApiError } from '@/lib/api';
import { type Invoice, type Payment } from '@/lib/api-client';

interface UseInvoicesOptions {
  page?: number;
  pageSize?: number;
  status?: Invoice['status'] | 'ALL';
  search?: string;
  guestId?: string;
  autoFetch?: boolean;
}

export function useInvoices(options: UseInvoicesOptions = {}) {
  const { autoFetch = true, ...params } = options;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: Record<string, unknown> = {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 50,
      };
      if (params.status && params.status !== 'ALL') query.status = params.status;
      if (params.search) query.search = params.search;
      if (params.guestId) query.guestId = params.guestId;

      const { data } = await api.get<{
        items: Invoice[];
        pagination: typeof pagination;
      }>('/api/invoices', { params: query });

      setInvoices(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.pageSize, params.status, params.search, params.guestId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (autoFetch) fetchInvoices();
  }, [fetchInvoices, autoFetch]);

  const getById = async (id: string): Promise<Invoice> => {
    const { data } = await api.get<{ invoice: Invoice }>(`/api/invoices/${id}`);
    return data.invoice;
  };

  const getPdfUrl = (id: string): string =>
    `${api.defaults.baseURL}/api/invoices/${id}/pdf`;

  const sendByEmail = async (id: string) => {
    await api.post(`/api/invoices/${id}/send`);
  };

  const recordPayment = async (
    invoiceId: string,
    payload: {
      amountCents: number;
      method: Payment['method'];
      reference?: string;
      notes?: string;
    },
  ) => {
    const { data } = await api.post<{ invoice: Invoice; payment: Payment }>(
      `/api/invoices/${invoiceId}/payments`,
      payload,
    );
    await fetchInvoices();
    return data;
  };

  const refundPayment = async (
    paymentId: string,
    amountCents: number,
    reason: string,
    notes?: string,
  ) => {
    await api.post(`/api/payments/${paymentId}/refund`, { amountCents, reason, notes });
    await fetchInvoices();
  };

  const issueInvoice = async (invoiceId: string) => {
    const { data } = await api.post<{ invoice: Invoice }>(`/api/invoices/${invoiceId}/issue`);
    await fetchInvoices();
    return data.invoice;
  };

  const voidInvoice = async (invoiceId: string, reason: string) => {
    await api.post(`/api/invoices/${invoiceId}/void`, { reason });
    await fetchInvoices();
  };

  return {
    invoices,
    pagination,
    loading,
    error,
    fetchInvoices,
    getById,
    getPdfUrl,
    sendByEmail,
    recordPayment,
    refundPayment,
    issueInvoice,
    voidInvoice,
  };
}
