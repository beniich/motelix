import { Badge, Tooltip } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

export function VipBadge({ vip }: { vip: boolean }) {
  if (!vip) return null;
  return (
    <Tooltip label="Client VIP">
      <Badge color="yellow" leftSection={<IconStar size={12} />}>VIP</Badge>
    </Tooltip>
  );
}
