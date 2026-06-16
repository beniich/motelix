'use client';

import { useCallback } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { enqueueMutation, type QueuedMutation } from '@/lib/offline-queue';
import { toast } from 'sonner';

type MutationOptions<TData> = {
  /** Human-readable description for the queue (shown in banner) */
  description: string;
  /** Called when online and mutation succeeds */
  onSuccess?: (data: TData) => void;
  /** Called on error (both online and offline flush) */
  onError?: (error: unknown) => void;
};

type MutationInput = {
  url: string;
  method: QueuedMutation['method'];
  body?: unknown;
  headers?: Record<string, string>;
};

/**
 * Wrapper around fetch that:
 *   – executes immediately when online
 *   – enqueues to IndexedDB when offline and shows a toast
 */
export function useOfflineMutation<TData = unknown>(options: MutationOptions<TData>) {
  const online = useOnlineStatus();

  const mutate = useCallback(
    async (input: MutationInput): Promise<TData | null> => {
      if (!online) {
        await enqueueMutation({
          url: input.url,
          method: input.method,
          body: input.body,
          headers: input.headers,
          description: options.description,
        });
        toast.warning(`Hors-ligne — ${options.description} mis en file d'attente`, {
          description: 'Sera synchronisé dès le retour du réseau.',
          duration: 5000,
        });
        return null;
      }

      try {
        const res = await fetch(input.url, {
          method: input.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(input.headers ?? {}),
          },
          body: input.body ? JSON.stringify(input.body) : undefined,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          const err = new Error((errBody as { message?: string }).message ?? `HTTP ${res.status}`);
          options.onError?.(err);
          toast.error(`Erreur: ${err.message}`);
          return null;
        }

        const data: TData = await res.json();
        options.onSuccess?.(data);
        return data;
      } catch (e) {
        options.onError?.(e);
        toast.error('Erreur réseau. Réessayez plus tard.');
        return null;
      }
    },
    [online, options]
  );

  return { mutate, online };
}
