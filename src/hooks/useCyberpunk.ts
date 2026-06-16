import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sapphire_cyberpunk_mode';

export function useCyberpunk() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
    if (enabled) {
      document.documentElement.classList.add('cyberpunk-mode');
    } else {
      document.documentElement.classList.remove('cyberpunk-mode');
    }
  }, [enabled]);

  const toggle = () => setEnabled((prev) => !prev);

  return { enabled, setEnabled, toggle };
}
