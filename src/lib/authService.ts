import api, { handleApiError, tokenStore } from './apiClient';
import type { CurrentUser, LoginResponse, Role } from '@/types';

// ============ MAPPING ROLE → CLEARANCE ============

const CLEARANCE_BY_ROLE: Record<Role, CurrentUser['clearance']> = {
  OPERATOR: 'LEVEL-4-ARRIVAL',
  MANAGER: 'LEVEL-5-PROPRIETOR',
  ADMIN: 'LEVEL-5-PROPRIETOR',
  SUPER_ADMIN: 'LEVEL-5-PROPRIETOR',
};

// ============ LOGIN ============

export async function login(email: string, password: string): Promise<CurrentUser> {
  try {
    // Le backend envoie le JWT via cookie httpOnly ET dans le body si token present
    const response = await api.post<{ user: CurrentUser; accessToken?: string; token?: string }>('/auth/login', { email, password });

    // Si le backend renvoie un token dans le body (mode Bearer), le stocker
    const accessToken = response.accessToken ?? response.token;
    if (accessToken) {
      tokenStore.set(accessToken);
    }

    const user: CurrentUser = {
      ...response.user,
      clearance: CLEARANCE_BY_ROLE[(response.user.role as Role)] ?? 'LEVEL-4-ARRIVAL',
    };

    // Stocker user en cache pour offline
    localStorage.setItem('sapphire_user_cache', JSON.stringify(user));

    return user;
  } catch (error) {
    throw handleApiError(error);
  }
}

// ============ LOGOUT ============

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // Ignorer les erreurs réseau, on déconnecte quand même localement
  } finally {
    tokenStore.clear();
    localStorage.removeItem('sapphire_user_cache');
  }
}

// ============ GET CURRENT USER ============

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  if (!tokenStore.getAccess()) return null;
  
  try {
    const user = await api.get<CurrentUser>('/auth/me');
    
    // Mapper role → clearance
    const userWithClearance: CurrentUser = {
      ...user,
      clearance: CLEARANCE_BY_ROLE[user.role],
    };
    
    localStorage.setItem('sapphire_user_cache', JSON.stringify(userWithClearance));
    return userWithClearance;
  } catch (e) {
    // Token invalide ou expiré
    tokenStore.clear();
    return null;
  }
}

// ============ GET CACHED USER (offline) ============

export function getCachedUser(): CurrentUser | null {
  try {
    const cached = localStorage.getItem('sapphire_user_cache');
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}
