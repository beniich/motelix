import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach Accept-Language from current locale
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const seg = window.location.pathname.split('/');
    const locale = seg[1];
    if (locale === 'en' || locale === 'fr') {
      config.headers['Accept-Language'] = locale;
    }
  }
  return config;
});

export type ApiError = {
  status: number;
  message: string;
  details?: Record<string, string[]>;
};

export function toApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 0;
    const data = err.response?.data as
      | { error?: string; details?: Record<string, string[]> }
      | undefined;
    return {
      status,
      message: data?.error ?? err.message,
      details: data?.details,
    };
  }
  return { status: 0, message: 'Erreur réseau' };
}
