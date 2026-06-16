import { create } from 'zustand';
import { api, toApiError, type ApiError } from './api';

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  hotelId: string;
  hotel?: { id: string; name: string };
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: ApiError | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clear: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<{ user: User }>('/api/auth/login', {
        email,
        password,
      });
      set({ user: data.user, isLoading: false });
    } catch (err) {
      const e = toApiError(err);
      set({ error: e, isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      set({ user: null, error: null });
    }
  },

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<{ user: User }>('/api/auth/me');
      set({ user: data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  clear: () => set({ user: null, error: null }),
}));
