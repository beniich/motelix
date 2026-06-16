import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  vip: boolean;
  totalStays: number;
  totalRevenue: number;
  lastStayAt: string | null;
  nationality?: string;
};

export type Segment = 'NEW' | 'OCCASIONAL' | 'REGULAR' | 'VIP' | 'LOST' | 'AT_RISK';

export type SegmentsData = {
  segments: Record<Segment, { count: number; revenue: number }>;
  guests: Array<Guest & { 
    segment: Segment; 
    segmentLabel: string; 
    recommendedActions: string[] 
  }>;
};

export function useSegments() {
  return useQuery({
    queryKey: ['segments'],
    queryFn: () => api.get<SegmentsData>('/segmentation'),
    staleTime: 5 * 60_000,
  });
}

export function useGuests(filters: { search?: string; vip?: boolean; page?: number } = {}) {
  return useQuery({
    queryKey: ['guests', filters],
    queryFn: () => api.get<{ items: Guest[]; pagination: any }>('/guests', filters),
    placeholderData: (prev) => prev,
  });
}

export function useGuest(id: string) {
  return useQuery({
    queryKey: ['guests', id],
    queryFn: () => api.get<{ guest: any }>(`/guests/${id}`).then(r => r.guest),
    enabled: !!id,
  });
}

export function useToggleVip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/guests/${id}/toggle-vip`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guests'] });
      qc.invalidateQueries({ queryKey: ['segments'] });
    },
  });
}
