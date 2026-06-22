'use client';

import { Table, Group, Text, Anchor } from '@mantine/core';
import Link from 'next/link';
import { VipBadge } from './VipBadge';
import { LoyaltyBadge } from './LoyaltyBadge';
import { formatPrice, fullName } from '@/lib/format';
import type { Guest } from '@/lib/api-client';

export function GuestsTable({ guests }: { guests: Guest[] }) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Client</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Téléphone</Table.Th>
          <Table.Th>Statut</Table.Th>
          <Table.Th>Séjours</Table.Th>
          <Table.Th>Total dépensé</Table.Th>
          <Table.Th>Dernier séjour</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {guests.map((g) => (
          <Table.Tr key={g.id} style={{ cursor: 'pointer' }}>
            <Table.Td>
              <Anchor component={Link} href={`/guests/${g.id}`} fw={600}>
                {fullName(g as any)}
              </Anchor>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{g.email}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{(g as any).phoneMasked ?? g.phone ?? '—'}</Text>
            </Table.Td>
            <Table.Td>
              <Group gap="xs">
                <VipBadge vip={g.vip || false} />
                <LoyaltyBadge tier={(g as any).loyaltyTier} points={(g as any).loyaltyPoints || 0} />
              </Group>
            </Table.Td>
            <Table.Td>{(g as any).totalStays || 0}</Table.Td>
            <Table.Td>{formatPrice((g as any).totalRevenueCents || 0)}</Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">
                {(g as any).lastStayAt ? new Date((g as any).lastStayAt).toLocaleDateString('fr-FR') : '—'}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
