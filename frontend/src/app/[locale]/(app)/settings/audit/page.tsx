'use client';

import { useState } from 'react';
import {
  Title,
  Stack,
  Card,
  Text,
  Group,
  Button,
  TextInput,
  Alert,
} from '@mantine/core';
import { IconDownload, IconShieldCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAudit } from '@/hooks/useAudit';
import { AuditLogTable } from '@/components/features/settings/AuditLogTable';

export default function AuditPage() {
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  
  const { events, loading, verifyIntegrity, exportEvents } = useAudit({
    action: actionFilter || undefined,
    resource: resourceFilter || undefined,
  });
  
  const handleVerify = async () => {
    try {
      const result = await verifyIntegrity();
      if (result.valid) {
        notifications.show({
          title: '✓ Chaîne intègre',
          message: `${result.eventsChecked} événements vérifiés`,
          color: 'green',
        });
      } else {
        notifications.show({
          title: '⚠️ Chaîne compromise',
          message: `Événement corrompu: ${result.brokenAt}`,
          color: 'red',
        });
      }
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de vérifier',
        color: 'red',
      });
    }
  };
  
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Audit & Sécurité</Title>
          <Text size="sm" c="dimmed" mt="xs">
            Journal forensique avec chaîne SHA-256 (impossible à altérer)
          </Text>
        </div>
        <Group>
          <Button
            variant="default"
            leftSection={<IconShieldCheck size={16} />}
            onClick={handleVerify}
          >
            Vérifier intégrité
          </Button>
          <Button
            variant="default"
            leftSection={<IconDownload size={16} />}
            onClick={exportEvents}
          >
            Export CSV
          </Button>
        </Group>
      </Group>
      
      <Alert color="blue" variant="light">
        <Text size="sm">
          🔒 Chaque action critique est enregistrée avec un hash SHA-256 chaîné.
          Toute modification d'un événement passé invalide tous les suivants.
        </Text>
      </Alert>
      
      <Card padding="md">
        <Group>
          <TextInput
            placeholder="Filtrer par action (ex: USER_LOGIN)"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <TextInput
            placeholder="Filtrer par ressource (ex: reservation)"
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>
      </Card>
      
      <Card padding={0}>
        {loading ? (
          <Card padding="lg">Chargement...</Card>
        ) : events.length === 0 ? (
          <Card padding="lg">
            <Text ta="center" c="dimmed">Aucun événement</Text>
          </Card>
        ) : (
          <AuditLogTable events={events} />
        )}
      </Card>
    </Stack>
  );
}
