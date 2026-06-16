'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (newLocale: 'en' | 'fr') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 glass rounded-lg p-1">
      <Globe className="w-4 h-4 ml-1" style={{ color: '#8E96BD' }} />
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className="px-2.5 py-1 text-xs font-medium rounded-md transition-all"
          style={
            locale === l
              ? { background: 'linear-gradient(135deg, #D4AF37, #F5E8B8)', color: '#0A0E27' }
              : { color: '#8E96BD' }
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
