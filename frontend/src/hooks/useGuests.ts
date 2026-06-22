'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, toApiError } from '@/lib/api';
import type { Guest, PaginatedResponse } from '@/lib/api-client';

interface UseGuestsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  vip?: boolean | 'ALL';
  loyaltyTier?: string;
  autoFetch?: boolean;
}

export function useGuests(options: UseGuestsOptions = {}) {
  const { autoFetch = true, ...params } = options;
  const [guests, setGuests] = useState<Guest[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, any> = {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 50,
      };
      if (params.search) queryParams.search = params.search;
      if (params.vip && params.vip !== 'ALL') queryParams.vip = params.vip.toString();
      if (params.loyaltyTier) queryParams.loyaltyTier = params.loyaltyTier;
      
      const { data } = await api.get<PaginatedResponse<Guest>>('/guests', {
        params: queryParams,
      });
      setGuests(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.pageSize, params.search, params.vip, params.loyaltyTier]);
  
  useEffect(() => {
    if (autoFetch) fetchGuests();
  }, [fetchGuests, autoFetch]);
  
  const getById = async (id: string) => {
    const { data } = await api.get<{ guest: Guest }>(`/guests/${id}`);
    return data.guest;
  };
  
  const create = async (payload: Partial<Guest>) => {
    const { data } = await api.post<{ guest: Guest }>('/guests', payload);
    await fetchGuests();
    return data.guest;
  };
  
  const update = async (id: string, payload: Partial<Guest>) => {
    const { data } = await api.patch<{ guest: Guest }>(`/guests/${id}`, payload);
    setGuests((prev) => prev.map((g) => (g.id === id ? data.guest : g)));
    return data.guest;
  };
  
  const anonymize = async (id: string) => {
    await api.post(`/guests/${id}/anonymize`);
    await fetchGuests();
  };
  
  const exportData = async (id: string): Promise<Blob> => {
    const response = await api.get(`/guests/${id}/export`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  };
  
  const toggleVip = async (id: string) => {
    const { data } = await api.patch<{ guest: Guest }>(`/guests/${id}/vip`);
    setGuests((prev) => prev.map((g) => (g.id === id ? data.guest : g)));
    return data.guest;
  };
  
  const updateLoyalty = async (id: string, loyaltyTier?: string, loyaltyPointsDelta?: number, reason?: string) => {
    const { data } = await api.patch<{ guest: Guest }>(`/guests/${id}/loyalty`, {
      loyaltyTier,
      loyaltyPointsDelta,
      reason,
    });
    return data.guest;
  };
  
  return {
    guests,
    pagination,
    loading,
    error,
    fetchGuests,
    getById,
    create,
    update,
    anonymize,
    exportData,
    toggleVip,
    updateLoyalty,
  };
}
