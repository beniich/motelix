'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/lib/auth';
import { OfflineBanner } from '@/components/OfflineBanner';
import { InstallPrompt } from '@/components/InstallPrompt';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, fetchMe } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchMe();
    }
  }, [user, isLoading, fetchMe]);

  // While loading, show a minimal dark screen with spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span
          className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-hidden scrollbar-thin">
        {children}
      </main>

      {/* PWA: offline indicator + queue sync */}
      <OfflineBanner />

      {/* PWA: install prompt (mobile/desktop) */}
      <InstallPrompt />
    </div>
  );
}
