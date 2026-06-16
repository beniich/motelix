import { useState, useEffect, useCallback } from 'react';
import type { CurrentUser, Role, ClearanceLevel } from '@/types';
import * as authService from '@/lib/authService';

// ============ MAPPING HELPERS ============

const CLEARANCE_BY_ROLE: Record<Role, ClearanceLevel> = {
  OPERATOR: 'LEVEL-4-ARRIVAL',
  MANAGER: 'LEVEL-5-PROPRIETOR',
  ADMIN: 'LEVEL-5-PROPRIETOR',
  SUPER_ADMIN: 'LEVEL-5-PROPRIETOR',
};

const ROLE_TO_DISPLAY: Record<Role, string> = {
  OPERATOR: 'Operator (Level 4)',
  MANAGER: 'Manager (Level 5)',
  ADMIN: 'Admin (Level 5)',
  SUPER_ADMIN: 'Super Admin (Level 5)',
};

// ============ HOOK ============

export interface UseAuthReturn {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOperator: boolean;
  isManager: boolean;
  isAdmin: boolean;
  hasRole: (role: Role) => boolean;
  hasClearance: (clearance: ClearanceLevel) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  switchRole: (role: Role) => void; // DEV ONLY
}

export function useAuth(): UseAuthReturn {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => authService.getCachedUser());
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch on mount
  useEffect(() => {
    (async () => {
      try {
        const user = await authService.fetchCurrentUser();
        setCurrentUser(user);
      } catch (e) {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await authService.login(email, password);
    const userWithClearance: CurrentUser = {
      ...user,
      clearance: CLEARANCE_BY_ROLE[user.role],
    };
    setCurrentUser(userWithClearance);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
    window.location.href = '/login';
  }, []);

  const refresh = useCallback(async () => {
    const user = await authService.fetchCurrentUser();
    setCurrentUser(user);
  }, []);

  // DEV ONLY: Switch role locally (no backend call)
  const switchRole = useCallback((role: Role) => {
    if (!currentUser) return;
    const newUser: CurrentUser = {
      ...currentUser,
      role,
      clearance: CLEARANCE_BY_ROLE[role],
    };
    setCurrentUser(newUser);
    localStorage.setItem('sapphire_user_cache', JSON.stringify(newUser));
  }, [currentUser]);

  return {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    isOperator: currentUser?.role === 'OPERATOR',
    isManager: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(currentUser?.role ?? ''),
    isAdmin: ['ADMIN', 'SUPER_ADMIN'].includes(currentUser?.role ?? ''),
    hasRole: (role: Role) => currentUser?.role === role,
    hasClearance: (clearance: ClearanceLevel) => {
      if (!currentUser) return false;
      const levels: Record<ClearanceLevel, number> = {
        'LEVEL-4-ARRIVAL': 4,
        'LEVEL-5-PROPRIETOR': 5,
      };
      return levels[currentUser.clearance] >= levels[clearance];
    },
    login,
    logout,
    refresh,
    switchRole,
  };
}
