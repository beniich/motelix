import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuditEvent = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'ROLE_ELEVATED' | 'ROLE_DEMOTED' | 'RESTRICTED_ACCESS_ATTEMPTED' | 'CLEARANCE_GRANTED';
  details: Record<string, unknown>;
  userAgent?: string;
};

interface AuditStore {
  events: AuditEvent[];
  log: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  clear: () => void;
}

export const useAuditLog = create<AuditStore>()(
  persist(
    (set) => ({
      events: [],
      log: (event) => {
        const fullEvent: AuditEvent = {
          ...event,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        };
        set((state) => ({
          events: [fullEvent, ...state.events].slice(0, 500),
        }));
      },
      clear: () => set({ events: [] }),
    }),
    { name: 'sapphire-audit-log' }
  )
);
