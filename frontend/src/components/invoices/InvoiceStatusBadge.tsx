'use client';

import { Badge } from '@/components/ui/Badge';
import type { Invoice } from '@/lib/api-client';
import { INVOICE_STATUS_CONFIG } from '@/lib/billing-helpers';

export function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
  const cfg = INVOICE_STATUS_CONFIG[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
