'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true when the browser reports it is online.
 * Uses window events `online` / `offline` which are more reliable than
 * the `navigator.connection` API.
 *
 * SSR-safe: defaults to `true` on the server so components don't flash
 * an "offline" state on first render.
 */
export function useOnlineStatus(): boolean {
  // Default to true for SSR; will be corrected on mount
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    // Immediately sync with actual browser state after hydration
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}
