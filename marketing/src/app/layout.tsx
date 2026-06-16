import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './Providers';
import { CookieBanner } from '@/components/CookieBanner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sapphire — Le PMS moderne pour hôtels de luxe',
  description: 'PMS + Channel Manager + BI + Mobile native. À partir de 99€/mois. Essayez gratuitement 14 jours.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://sapphire.luxury',
    siteName: 'Sapphire',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Sapphire' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-midnight-900 text-midnight-50`}
      >
        <Providers>
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
