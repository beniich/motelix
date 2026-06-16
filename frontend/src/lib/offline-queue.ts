import { get, set, del, keys } from 'idb-keyval';

export type QueuedMutation = {
  id: string;
  url: string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  createdAt: number;
  retries: number;
  description: string;
};

const QUEUE_PREFIX = 'mutation:';
const QUEUE_META_KEY = 'mutation:meta';

type QueueMeta = {
  count: number;
  lastSyncAt: number | null;
};

export async function enqueueMutation(mutation: Omit<QueuedMutation, 'id' | 'createdAt' | 'retries'>) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const queued: QueuedMutation = {
    ...mutation,
    id,
    createdAt: Date.now(),
    retries: 0,
  };
  await set(`${QUEUE_PREFIX}${id}`, queued);
  await updateMeta({ count: (await getMeta()).count + 1, lastSyncAt: null });
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    try {
      // @ts-ignore – sync exists at runtime
      await reg.sync.register('sync-mutations');
    } catch {
      // Sync not supported, fallback handled elsewhere
    }
  }
  return queued;
}

export async function getQueue(): Promise<QueuedMutation[]> {
  const allKeys = (await keys()).filter(
    (k) => String(k).startsWith(QUEUE_PREFIX) && k !== QUEUE_META_KEY
  );
  const items = await Promise.all(allKeys.map((k) => get<QueuedMutation>(k)));
  return items
    .filter((m): m is QueuedMutation => m !== undefined)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function removeMutation(id: string) {
  await del(`${QUEUE_PREFIX}${id}`);
  const meta = await getMeta();
  await updateMeta({ count: Math.max(0, meta.count - 1), lastSyncAt: meta.lastSyncAt });
}

async function getMeta(): Promise<QueueMeta> {
  return (await get<QueueMeta>(QUEUE_META_KEY)) ?? { count: 0, lastSyncAt: null };
}

async function updateMeta(meta: QueueMeta) {
  await set(QUEUE_META_KEY, meta);
}

export async function getQueueMeta(): Promise<QueueMeta> {
  return getMeta();
}

/** Replays the queue. Called on network regain or manually. */
export async function flushQueue(): Promise<{ succeeded: number; failed: number; errors: Error[] }> {
  const queue = await getQueue();
  let succeeded = 0;
  let failed = 0;
  const errors: Error[] = [];

  for (const mutation of queue) {
    try {
      const res = await fetch(mutation.url, {
        method: mutation.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(mutation.headers ?? {}),
        },
        body: mutation.body ? JSON.stringify(mutation.body) : undefined,
      });
      if (!res.ok) {
        if (res.status >= 400 && res.status < 500) {
          await removeMutation(mutation.id);
          failed++;
          continue;
        }
        // 5xx – keep for retry
        mutation.retries++;
        await set(`${QUEUE_PREFIX}${mutation.id}`, mutation);
        failed++;
        continue;
      }
      await removeMutation(mutation.id);
      succeeded++;
    } catch (e) {
      mutation.retries++;
      await set(`${QUEUE_PREFIX}${mutation.id}`, mutation);
      errors.push(e as Error);
      failed++;
    }
  }

  const meta = await getMeta();
  await updateMeta({ count: 0, lastSyncAt: Date.now() });
  return { succeeded, failed, errors };
}
