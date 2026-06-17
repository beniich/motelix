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
      <Globe className="w-4 h-4 ml-1 text-gray-400" />
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={
            `px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              locale === l
                ? 'bg-gradient-to-br from-amber-400 to-amber-200 text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
