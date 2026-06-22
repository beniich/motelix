import { Badge, Tooltip } from '@mantine/core';
import { LOYALTY_TIERS, type LoyaltyTier } from '@/lib/guest-helpers';

export function LoyaltyBadge({ tier, points }: { tier?: string | null; points: number }) {
  if (!tier) return null;
  const config = LOYALTY_TIERS[tier as LoyaltyTier];
  if (!config) return null;
  
  return (
    <Tooltip label={`${points.toLocaleString('fr-FR')} points`}>
      <Badge color={config.color} variant="filled">
        {config.label}
      </Badge>
    </Tooltip>
  );
}
