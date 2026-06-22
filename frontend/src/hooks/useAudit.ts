'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, toApiError } from '@/lib/api';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  resourceId?: string;
  before?: any;
  after?: any;
  metadata?: any;
  hash: string;
  previousHash: string;
}

interface UseAuditOptions {
  page?: number;
  pageSize?: number;
  actor?: string;
  resource?: string;
  resourceId?: string;
  action?: string;
  from?: string;
  to?: string;
}

export function useAudit(options: UseAuditOptions = {}) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, any> = {
        page: options.page ?? 1,
        pageSize: options.pageSize ?? 50,
      };
      if (options.actor) queryParams.actor = options.actor;
      if (options.resource) queryParams.resource = options.resource;
      if (options.resourceId) queryParams.resourceId = options.resourceId;
      if (options.action) queryParams.action = options.action;
      if (options.from) queryParams.from = options.from;
      if (options.to) queryParams.to = options.to;
      
      const { data } = await api.get<{
        items: AuditEvent[];
        pagination: typeof pagination;
      }>('/audit', { params: queryParams });
      
      setEvents(data.items);
      setPagination(data.pagination);
    } catch (err) {
      console.error(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [options.page, options.pageSize, options.actor, options.resource, options.resourceId, options.action, options.from, options.to]);
  
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  const verifyIntegrity = async () => {
    const { data } = await api.get<{ valid: boolean; eventsChecked: number; brokenAt: string | null }>(
      '/audit/verify'
    );
    return data;
  };
  
  const exportEvents = async () => {
    const response = await api.get('/audit/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(response.data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  
  return { events, pagination, loading, fetchEvents, verifyIntegrity, exportEvents };
}
