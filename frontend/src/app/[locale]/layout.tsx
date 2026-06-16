import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { Providers } from '../providers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Sapphire — Centre d'opérations",
  description: "Centre d'opérations pour hôtellerie de luxe",
};

export const viewport: Viewport = {
  themeColor: '#0A0E27',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Preconnect for Google Fonts (non-blocking — falls back gracefully) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* CSS custom property font stacks used throughout the app */}
        <style>{`
          :root {
            --font-inter: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
            --font-playfair: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
          }
        `}</style>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-inter)' }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
