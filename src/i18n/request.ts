import { getRequestConfig } from 'next-intl/server';

// Define the locales supported by the application
export const locales = ['en', 'fr'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig({
  locales,
  defaultLocale: 'en',
  // Dynamically import locale messages (adjust path if messages are stored elsewhere)
  loadLocale: (locale) => import(`./${locale}.json`),
});
