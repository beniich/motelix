'use client';

import {
  Table,
  Badge,
  Code,
  Text,
} from '@mantine/core';
import type { AuditEvent } from '@/hooks/useAudit';

const ACTION_COLORS: Record<string, string> = {
  USER_LOGIN: 'green',
  USER_LOGIN_FAILED: 'red',
  USER_LOGOUT: 'gray',
  USER_REGISTERED: 'blue',
  USER_ROLE_CHANGED: 'orange',
  PASSWORD_CHANGED: 'orange',
  HOTEL_CREATED: 'blue',
  HOTEL_UPDATED: 'yellow',
  ROOM_STATUS_CHANGED: 'cyan',
  RESERVATION_CREATED: 'green',
  RESERVATION_CANCELLED: 'red',
  RESERVATION_CHECKED_IN: 'teal',
  RESERVATION_CHECKED_OUT: 'teal',
  GUEST_CREATED: 'blue',
  GUEST_ANONYMIZED: 'red',
  GUEST_PII_ACCESSED: 'orange',
  INVOICE_PAYMENT_RECORDED: 'green',
  PAYMENT_REFUNDED: 'orange',
};

export function AuditLogTable({ events }: { events: AuditEvent[] }) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Date</Table.Th>
          <Table.Th>Acteur</Table.Th>
          <Table.Th>Action</Table.Th>
          <Table.Th>Ressource</Table.Th>
          <Table.Th>Détails</Table.Th>
          <Table.Th>Hash</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {events.map((event) => (
          <Table.Tr key={event.id}>
            <Table.Td>
              <Text size="sm">
                {new Date(event.timestamp).toLocaleString('fr-FR')}
              </Text>
            </Table.Td>
            <Table.Td>
              <Code style={{ fontSize: 11 }}>{event.actor.substring(0, 12)}...</Code>
            </Table.Td>
            <Table.Td>
              <Badge color={ACTION_COLORS[event.action] ?? 'gray'} variant="light">
                {event.action}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="sm">
                {event.resource}
                {event.resourceId && (
                  <Text component="span" size="xs" c="dimmed">
                    {' '}#{event.resourceId.substring(0, 8)}
                  </Text>
                )}
              </Text>
            </Table.Td>
            <Table.Td>
              {event.metadata && (
                <Code style={{ fontSize: 10 }}>
                  {JSON.stringify(event.metadata).substring(0, 50)}...
                </Code>
              )}
            </Table.Td>
            <Table.Td>
              <Code style={{ fontSize: 10 }}>{event.hash.substring(0, 12)}...</Code>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
