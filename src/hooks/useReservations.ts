import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';
import type { Reservation } from '@/types';

export type ReservationFilters = {
  page?: number;
  pageSize?: number;
  status?: string;
  guestId?: string;
  roomId?: string;
  source?: string;
  checkInFrom?: string;
  checkInTo?: string;
  search?: string;
};

export type PaginatedReservations = {
  items: Reservation[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
};

export function useReservations(filters: ReservationFilters = {}) {
  return useQuery({
    queryKey: ['reservations', filters],
    queryFn: () => api.get<PaginatedReservations>('/reservations', filters),
    placeholderData: (prev) => prev,
  });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: ['reservations', id],
    queryFn: () => api.get<{ reservation: Reservation }>(`/reservations/${id}`).then(r => r.reservation),
    enabled: !!id,
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<{ reservation: Reservation }>('/reservations', data).then(r => r.reservation),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useUpdateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      api.patch<{ reservation: Reservation }>(`/reservations/${id}`, data).then(r => r.reservation),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['reservations'] });
      qc.setQueryData(['reservations', res.id], res);
    },
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api.post<{ reservation: Reservation }>(`/reservations/${id}/cancel`, { reason }).then(r => r.reservation),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}

export function useGuestSearch(q: string) {
  return useQuery({
    queryKey: ['guests', 'search', q],
    queryFn: () => api.get<{ hits: any[] }>('/guests', { search: q, pageSize: 10 }).then(r => r.hits),
    enabled: q.length >= 2,
  });
}
