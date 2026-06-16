import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/apiClient';
import type { HousekeepingTask, Room } from '@/types';

export function useHousekeepingTasks(filters: { 
  status?: string; 
  assigneeId?: string;
  roomId?: string;
} = {}) {
  return useQuery({
    queryKey: ['housekeeping', 'tasks', filters],
    queryFn: () => api.get<HousekeepingTask[]>('/housekeeping', { ...filters, pageSize: 100 }),
    refetchInterval: 15000, // 15s refresh (terrain needs fresh data)
  });
}

export function useRoomsWithStatus() {
  return useQuery({
    queryKey: ['rooms', 'with-status'],
    queryFn: () => api.get<Room[]>('/rooms', { pageSize: 200 }),
    refetchInterval: 30000,
  });
}

export function useStartTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.post(`/housekeeping/${taskId}/start`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['housekeeping'] }),
  });
}

export function useCompleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      taskId, 
      checklist, 
      issueReported, 
      issueDescription 
    }: { 
      taskId: string;
      checklist?: Record<string, boolean>;
      issueReported?: boolean;
      issueDescription?: string;
    }) => api.post(`/housekeeping/${taskId}/complete`, { 
      checklist, issueReported, issueDescription 
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['housekeeping'] }),
  });
}

export function useInspectTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, approved, notes }: { taskId: string; approved: boolean; notes?: string }) =>
      api.post(`/housekeeping/${taskId}/inspect`, { approved, notes }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['housekeeping'] }),
  });
}
