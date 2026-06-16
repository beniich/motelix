import { Shield, Eye } from 'lucide-react';
import type { CurrentUser } from '../../lib/rbac';

export function RoleBadge({ user }: { user: CurrentUser }) {
  const isManager = user.role === 'MANAGER';
  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest
      ${isManager
        ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
        : 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30'
      }
    `}>
      {isManager ? <Shield className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
      {user.clearance}
    </div>
  );
}
