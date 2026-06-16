import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';

export type Channel = {
  id: string;
  type: 'BOOKING_COM' | 'EXPEDIA' | 'AIRBNB' | 'AGODA' | 'HOTELS_COM' | 'CUSTOM_OTA' | 'DIRECT';
  status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ERROR' | 'DISCONNECTED';
  externalHotelId: string | null;
  lastPushAt: string | null;
  lastPullAt: string | null;
  lastErrorMessage: string | null;
  autoPushAvailability: boolean;
  autoPushRates: boolean;
  autoPullReservations: boolean;
  config: any;
  createdAt: string;
};

export type SyncLog = {
  id: string;
  channel: { type: string };
  direction: 'PUSH' | 'PULL';
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'IN_PROGRESS';
  operation: string;
  itemsCount: number;
  successCount: number;
  failedCount: number;
  errorMessage: string | null;
  startedAt: string;
  duration: number | null;
};

export const CHANNEL_META: Record<string, { name: string; color: string; docsUrl: string }> = {
  BOOKING_COM: { 
    name: 'Booking.com', 
    color: 'bg-blue-500', 
    docsUrl: 'https://connectivity.booking.com/' 
  },
  EXPEDIA: { 
    name: 'Expedia', 
    color: 'bg-yellow-500', 
    docsUrl: 'https://developer.expediapartnersolutions.com/' 
  },
  AIRBNB: { 
    name: 'Airbnb', 
    color: 'bg-rose-500', 
    docsUrl: 'https://www.airbnb.com/partner/channels' 
  },
  AGODA: { 
    name: 'Agoda', 
    color: 'bg-purple-500', 
    docsUrl: 'https://ycs.agoda.com/' 
  },
  HOTELS_COM: { 
    name: 'Hotels.com', 
    color: 'bg-red-600', 
    docsUrl: 'https://developer.hotels.com/' 
  },
};

export function useChannels() {
  return useQuery({
    queryKey: ['channels'],
    queryFn: () => api.get<{ channels: Channel[] }>('/channels').then(r => r.channels),
    refetchInterval: 30_000,
  });
}

export function useAvailableChannelTypes() {
  return useQuery({
    queryKey: ['channels', 'types'],
    queryFn: () => api.get<{ types: any[] }>('/channels/types').then(r => r.types),
  });
}

export function useCreateChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { 
      type: string; 
      credentials: Record<string, string>; 
      markup?: number 
    }) => api.post<{ channel: Channel }>('/channels', data).then(r => r.channel),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

export function usePauseChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/channels/${id}/pause`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

export function useResumeChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/channels/${id}/resume`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

export function useDeleteChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/channels/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

export function usePushChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/channels/${id}/push`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

export function usePullChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/channels/${id}/pull`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

export function useSyncAllChannels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ push: any[]; pull: any[] }>('/channels/sync-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });
}

export function useChannelSyncLogs() {
  return useQuery({
    queryKey: ['channels', 'sync-logs'],
    queryFn: () => api.get<{ items: SyncLog[] }>('/channels/sync-logs', { pageSize: 20 }).then(r => r.items),
  });
}
