import { create } from 'zustand';
import { api, type ApiError } from './api';
import { saveToken, getToken, saveUser, getUser, clearAll } from './secure-store';

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
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  initialize: async () => {
    const token = await getToken();
    const cachedUser = await getUser<User>();
    if (token && cachedUser) {
      set({ user: cachedUser });
    }
    set({ isInitialized: true });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<{ token: string; user: User }>('/api/auth/login-mobile', { email, password });
      await saveToken(data.token);
      await saveUser(data.user);
      set({ user: data.user, isLoading: false });
    } catch (e) {
      set({ error: e as ApiError, isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await clearAll();
    set({ user: null, error: null });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get<{ user: User }>('/api/auth/me');
      await saveUser(data.user);
      set({ user: data.user });
    } catch {
      await clearAll();
      set({ user: null });
    }
  },
}));
