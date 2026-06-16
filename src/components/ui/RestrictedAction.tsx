import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RestrictedActionProps {
  action: string;
  children: ReactNode;
}

export function RestrictedAction({ action, children }: RestrictedActionProps) {
  const { currentUser } = useAuth();
  
  // Dans une vraie app, on vérifierait si currentUser.role ou currentUser.permissions
  // permet l'action demandée. Pour le moment, on affiche tout si l'utilisateur est connecté.
  if (!currentUser) return null;
  
  return <>{children}</>;
}
