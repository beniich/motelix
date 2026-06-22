'use client';

import { Badge } from '@/components/ui/Badge';
import type { HousekeepingStatus } from '@/lib/api-client';

const CONFIG: Record<HousekeepingStatus, { label: string; variant: 'default' | 'info' | 'success' | 'warning' | 'danger' }> = {
  PENDING:     { label: 'À faire',     variant: 'warning' },
  IN_PROGRESS: { label: 'En cours',    variant: 'info' },
  COMPLETED:   { label: 'Terminé',     variant: 'success' },
  INSPECTED:   { label: 'Inspecté',    variant: 'default' },
  REJECTED:    { label: 'Rejeté',      variant: 'danger' },
};

export function HousekeepingStatusBadge({ status }: { status: HousekeepingStatus }) {
  const cfg = CONFIG[status] || { label: status, variant: 'default' };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
