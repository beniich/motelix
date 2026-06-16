import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';
import type { Reservation } from '@/types';

// ============ QUERIES ============

export function useTodayArrivals() {
  return useQuery({
    queryKey: ['arrivals', 'today'],
    queryFn: () => api.get<Reservation[]>('/reservations', { 
      status: 'CONFIRMED',
      checkInFrom: new Date().toISOString().split('T')[0],
      checkInTo: new Date().toISOString().split('T')[0],
    }),
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useArrivalsHistory(days: number = 7) {
  return useQuery({
    queryKey: ['arrivals', 'history', days],
    queryFn: () => api.get<Reservation[]>('/reservations', { 
      checkInFrom: new Date(Date.now() - days * 86400000).toISOString().split('T')[0],
      checkInTo: new Date().toISOString().split('T')[0],
      pageSize: 100,
    }),
  });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: ['reservations', id],
    queryFn: () => api.get<Reservation>(`/reservations/${id}`),
    enabled: !!id,
  });
}

// ============ MUTATIONS ============

export function useCheckIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) =>
      api.post<Reservation>(`/reservations/${reservationId}/check-in`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['arrivals'] });
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useCheckOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) =>
      api.post<Reservation>(`/reservations/${reservationId}/check-out`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['arrivals'] });
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api.post<Reservation>(`/reservations/${id}/cancel`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['arrivals'] });
    },
  });
}
