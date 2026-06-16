import axios, { AxiosError } from 'axios';
import { router } from 'expo-router';
import { config } from '../config';
import { getToken, clearAll } from './secure-store';

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor : ajoute le token automatiquement
api.interceptors.request.use(async (reqConfig) => {
  const token = await getToken();
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

// Interceptor : gère 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await clearAll();
      // Redirige vers login
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);
