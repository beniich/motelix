import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';

// ============ CONFIGURATION ============

const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const TOKEN_KEY = 'sapphire_token';
const REFRESH_KEY = 'sapphire_refresh_token';

// ============ TOKEN STORAGE ============

export const tokenStore = {
  getAccess: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh?: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ============ AXIOS INSTANCE ============

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // CRUCIAL pour cookies httpOnly cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ REQUEST INTERCEPTOR ============

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Si on a un token Bearer (mobile-style), l'attacher
    const token = tokenStore.getAccess();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============ RESPONSE INTERCEPTOR ============

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Si 401 et pas déjà retenté → tenter un refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = tokenStore.getRefresh();
        if (!refreshToken) throw new Error('No refresh token');
        
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        
        tokenStore.set(data.accessToken, data.refreshToken);
        onTokenRefreshed(data.accessToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenStore.clear();
        window.location.href = '/login?expired=1';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// ============ ERROR HANDLER ============

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    return {
      status: axiosError.response?.status ?? 0,
      message: axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message,
      details: axiosError.response?.data,
    };
  }
  return { status: 0, message: 'Unknown error', details: error };
}

// ============ TYPED API METHODS ============

export const api = {
  get: <T>(url: string, params?: Record<string, any>) =>
    apiClient.get<T>(url, { params }).then((r) => r.data),
  post: <T>(url: string, data?: any) =>
    apiClient.post<T>(url, data).then((r) => r.data),
  patch: <T>(url: string, data?: any) =>
    apiClient.patch<T>(url, data).then((r) => r.data),
  put: <T>(url: string, data?: any) =>
    apiClient.put<T>(url, data).then((r) => r.data),
  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((r) => r.data),
};

export default api;
