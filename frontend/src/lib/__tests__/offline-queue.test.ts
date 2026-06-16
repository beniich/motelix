import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock idb-keyval
const store: Record<string, unknown> = {};
vi.mock('idb-keyval', () => ({
  get: vi.fn(async (key: string) => store[key]),
  set: vi.fn(async (key: string, val: unknown) => { store[key] = val; }),
  del: vi.fn(async (key: string) => { delete store[key]; }),
  keys: vi.fn(async () => Object.keys(store)),
}));

// Mock fetch
global.fetch = vi.fn();

import {
  enqueueMutation,
  getQueue,
  removeMutation,
  flushQueue,
} from '@/lib/offline-queue';

describe('offline-queue', () => {
  beforeEach(() => {
    // Clear the store between tests
    for (const key of Object.keys(store)) delete store[key];
    vi.clearAllMocks();
  });

  it('should enqueue a mutation and retrieve it', async () => {
    await enqueueMutation({
      url: '/api/rooms/1',
      method: 'PATCH',
      body: { status: 'CLEANING' },
      description: 'Mise à jour statut chambre',
    });

    const queue = await getQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].url).toBe('/api/rooms/1');
    expect(queue[0].method).toBe('PATCH');
    expect(queue[0].retries).toBe(0);
  });

  it('should remove a mutation by id', async () => {
    await enqueueMutation({
      url: '/api/tasks/2',
      method: 'DELETE',
      description: 'Suppression tâche',
    });

    const before = await getQueue();
    expect(before).toHaveLength(1);

    await removeMutation(before[0].id);
    const after = await getQueue();
    expect(after).toHaveLength(0);
  });

  it('should flush queue successfully and remove items', async () => {
    await enqueueMutation({
      url: '/api/rooms/1',
      method: 'PATCH',
      body: { status: 'AVAILABLE' },
      description: 'Test flush',
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1' }),
    });

    const result = await flushQueue();
    expect(result.succeeded).toBe(1);
    expect(result.failed).toBe(0);

    const queue = await getQueue();
    expect(queue).toHaveLength(0);
  });

  it('should keep 5xx items in queue for retry', async () => {
    await enqueueMutation({
      url: '/api/rooms/1',
      method: 'PATCH',
      body: { status: 'MAINTENANCE' },
      description: 'Test 5xx',
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const result = await flushQueue();
    expect(result.failed).toBe(1);
    expect(result.succeeded).toBe(0);

    const queue = await getQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].retries).toBe(1);
  });

  it('should discard 4xx items from queue', async () => {
    await enqueueMutation({
      url: '/api/rooms/404',
      method: 'DELETE',
      description: 'Test 4xx',
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await flushQueue();
    expect(result.failed).toBe(1);

    const queue = await getQueue();
    expect(queue).toHaveLength(0); // discarded
  });

  it('should sort queue by createdAt (FIFO)', async () => {
    await enqueueMutation({ url: '/api/a', method: 'POST', description: 'A' });
    await new Promise((r) => setTimeout(r, 5));
    await enqueueMutation({ url: '/api/b', method: 'POST', description: 'B' });

    const queue = await getQueue();
    expect(queue[0].url).toBe('/api/a');
    expect(queue[1].url).toBe('/api/b');
  });
});
