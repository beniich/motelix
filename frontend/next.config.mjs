import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProd = process.env.NODE_ENV === 'production';

// Configure next‑pwa – only enabled in production to avoid interfering with dev HMR
const withPwa = isProd
  ? (await import('next-pwa')).default({
      dest: 'public',
      cacheOnFrontEndNav: true,
      aggressiveFrontEndNavCaching: true,
      reloadOnOnline: true,
      disable: false,
      workboxOptions: {
        navigateFallback: '/fr/dashboard',
        navigateFallbackDenylist: [/^\/api/, /^\/_next/, /^\/fr\/login/, /^\/en\/login/],
        runtimeCaching: [
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // Next.js static assets
          {
            urlPattern: /\/_next\/static\/.+/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'next-static',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Images
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // API GET – network first with cache fallback
          {
            urlPattern: /\/api\/(rooms|tasks|users|hotel|search)/,
            method: 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Auth – never cache
          {
            urlPattern: /\/api\/auth/,
            method: 'GET',
            handler: 'NetworkOnly',
          },
        ],
      },
    })
  : (cfg) => cfg;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force webpack (disable Turbopack) for next-intl v4 compatibility
};

export default withNextIntl(withPwa(nextConfig));
