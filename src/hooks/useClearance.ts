import { useState, useCallback } from 'react';
import type { CurrentUser, UserRole } from '../lib/rbac';
import { useAuditLog } from '../lib/auditLog';

const DEFAULT_USERS: Record<UserRole, CurrentUser> = {
  OPERATOR: {
    id: 'op-001',
    name: 'Alex Chen',
    role: 'OPERATOR',
    clearance: 'LEVEL-4-ARRIVAL',
  },
  MANAGER: {
    id: 'mgr-001',
    name: 'Lord Alexander',
    role: 'MANAGER',
    clearance: 'LEVEL-5-PROPRIETOR',
  },
};

export function useClearance() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(DEFAULT_USERS.OPERATOR);
  const { log } = useAuditLog();

  const elevate = useCallback(() => {
    const prev = currentUser;
    setCurrentUser((u) => ({
      ...u,
      id: 'mgr-001',
      name: 'Lord Alexander',
      role: 'MANAGER',
      clearance: 'LEVEL-5-PROPRIETOR',
    }));
    log({
      userId: prev.id,
      userName: prev.name,
      action: 'ROLE_ELEVATED',
      details: {
        from: prev.clearance,
        to: 'LEVEL-5-PROPRIETOR',
        method: 'clearance_lock_button',
      },
    });
  }, [currentUser, log]);

  const demote = useCallback(() => {
    const prev = currentUser;
    setCurrentUser((u) => ({
      ...u,
      id: 'op-001',
      name: 'Alex Chen',
      role: 'OPERATOR',
      clearance: 'LEVEL-4-ARRIVAL',
    }));
    log({
      userId: prev.id,
      userName: prev.name,
      action: 'ROLE_DEMOTED',
      details: {
        from: prev.clearance,
        to: 'LEVEL-4-ARRIVAL',
      },
    });
  }, [currentUser, log]);

  const switchRole = useCallback(
    (role: UserRole) => {
      const prev = currentUser;
      const next = DEFAULT_USERS[role];
      setCurrentUser(next);
      log({
        userId: prev.id,
        userName: prev.name,
        action: role === 'MANAGER' ? 'ROLE_ELEVATED' : 'ROLE_DEMOTED',
        details: {
          from: prev.clearance,
          to: next.clearance,
          method: 'profile_switch',
        },
      });
    },
    [currentUser, log]
  );

  return {
    currentUser,
    elevate,
    demote,
    switchRole,
    isOperator: currentUser.role === 'OPERATOR',
    isManager: currentUser.role === 'MANAGER',
  };
}
