'use client';

declare global {
  interface Window { plausible?: (name: string, props?: any) => void; }
}

export function trackEventClient(name: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  if (window.plausible) {
    window.plausible(name, { props: properties });
  }
  console.log(`[Track] ${name}`, properties);
}
