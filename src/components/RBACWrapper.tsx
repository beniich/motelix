import type { ReactNode } from 'react';
import type { CurrentUser } from '../lib/rbac';
import { hasAccess } from '../lib/rbac';
import { ClearanceLock } from './ClearanceLock';

interface RBACWrapperProps {
  tabId: string;
  currentUser: CurrentUser;
  children: ReactNode;
  onElevate: () => void;
}

export function renderWithRBAC({ tabId, currentUser, children, onElevate }: RBACWrapperProps) {
  if (!hasAccess(currentUser, tabId)) {
    return <ClearanceLock tabId={tabId} currentUser={currentUser} onElevate={onElevate} />;
  }
  return <>{children}</>;
}
