import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Public paths that don't require auth (without locale prefix)
const PUBLIC_PATHS = ['/login'];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Strip locale prefix to get the raw path
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';

  const sessionCookie = req.cookies.get('sapphire_token');
  const isPublic = PUBLIC_PATHS.some((p) => pathWithoutLocale.startsWith(p));
  const isLoginPage = pathWithoutLocale.startsWith('/login');

  // No session on protected route → redirect to /login
  if (!sessionCookie && !isPublic && pathWithoutLocale !== '/') {
    const locale = pathname.split('/')[1] || routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Has session and tries to visit login → redirect to dashboard
  if (sessionCookie && isLoginPage) {
    const locale = pathname.split('/')[1] || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
