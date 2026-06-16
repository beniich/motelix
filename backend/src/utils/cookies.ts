import type { Response } from 'express';
import { env } from '../config/env.js';

const COOKIE_NAME = 'sapphire_token';
const isProd = env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,                          // false en dev (HTTP localhost)
  sameSite: isProd ? ('none' as const) : ('lax' as const),
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 jours
};

export function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, cookieOptions);
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
}

export { COOKIE_NAME };
