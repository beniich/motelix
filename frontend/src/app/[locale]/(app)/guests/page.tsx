'use client';

import { useState } from 'react';
import {
  Title,
  Group,
  Button,
  Card,
  Stack,
  TextInput,
  Select,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useGuests } from '@/hooks/useGuests';
import { GuestsTable } from '@/components/features/guests/GuestsTable';
import { GuestFormModal } from '@/components/features/guests/GuestFormModal';

export default function GuestsPage() {
  const [search, setSearch] = useState('');
  const [vipFilter, setVipFilter] = useState<string>('ALL');
  const [formOpened, setFormOpened] = useState(false);
  
  const { guests, loading, fetchGuests } = useGuests({
    search: search || undefined,
    vip: vipFilter === 'ALL' ? 'ALL' : vipFilter === 'true',
    pageSize: 100,
  });
  
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Clients</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setFormOpened(true)}>
          Nouveau client
        </Button>
      </Group>
      
      <Card padding="md">
        <Group>
          <TextInput
            placeholder="Rechercher par nom, email, ville..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            data={[
              { value: 'ALL', label: 'Tous' },
              { value: 'true', label: '⭐ VIP uniquement' },
              { value: 'false', label: 'Non-VIP' },
            ]}
            value={vipFilter}
            onChange={(v) => v && setVipFilter(v)}
            w={180}
          />
        </Group>
      </Card>
      
      <Card padding={0}>
        {loading ? (
          <Card padding="lg">Chargement...</Card>
        ) : guests.length === 0 ? (
          <Card padding="lg">
            <Stack align="center" gap="xs">
              <Title order={4}>Aucun client</Title>
              <Title order={6} c="dimmed">Créez votre premier client</Title>
            </Stack>
          </Card>
        ) : (
          <GuestsTable guests={guests} />
        )}
      </Card>
      
      <GuestFormModal
        opened={formOpened}
        onClose={() => setFormOpened(false)}
        onSuccess={fetchGuests}
      />
    </Stack>
  );
}
