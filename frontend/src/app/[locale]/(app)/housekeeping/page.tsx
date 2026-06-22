'use client';

import { useEffect, useState } from 'react';
import {
  Title,
  Stack,
  Group,
  Button,
  Text,
  SimpleGrid,
  Card,
  Badge,
} from '@mantine/core';
import {
  IconRefresh,
  IconCalendarPlus,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { api, toApiError } from '@/lib/api';
import { TaskCard } from '@/components/features/housekeeping/TaskCard';

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchBoard = async () => {
    try {
      const { data } = await api.get('/housekeeping/board');
      setTasks(data.board?.tasks ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const autoGenerate = async () => {
    try {
      const { data } = await api.post('/housekeeping/auto-generate', {
        type: 'CHECKOUT_CLEAN',
        assignToAvailableStaff: true,
      });
      notifications.show({
        title: 'Tâches générées',
        message: `${data.created} nouvelles tâches`,
        color: 'green',
      });
      fetchBoard();
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: toApiError(err).message,
        color: 'red',
      });
    }
  };
  
  useEffect(() => {
    fetchBoard();
  }, []);
  
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t) => ['COMPLETED', 'INSPECTED'].includes(t.status));
  
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Housekeeping</Title>
          <Text size="sm" c="dimmed" mt="xs">
            Tableau de bord pour la coordination des équipes de ménage
          </Text>
        </div>
        <Group>
          <Button
            variant="default"
            leftSection={<IconRefresh size={16} />}
            onClick={fetchBoard}
          >
            Rafraîchir
          </Button>
          <Button
            leftSection={<IconCalendarPlus size={16} />}
            onClick={autoGenerate}
          >
            Auto-générer
          </Button>
        </Group>
      </Group>
      
      {/* Stats */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card padding="md">
          <Text size="sm" c="dimmed">En attente</Text>
          <Text fw={700} size="xl" c="gray">{pendingTasks.length}</Text>
        </Card>
        <Card padding="md">
          <Text size="sm" c="dimmed">En cours</Text>
          <Text fw={700} size="xl" c="blue">{inProgressTasks.length}</Text>
        </Card>
        <Card padding="md">
          <Text size="sm" c="dimmed">Terminées</Text>
          <Text fw={700} size="xl" c="green">{completedTasks.length}</Text>
        </Card>
      </SimpleGrid>
      
      {/* Tasks grouped by floor */}
      {loading ? (
        <Text ta="center">Chargement...</Text>
      ) : tasks.length === 0 ? (
        <Card padding="xl">
          <Stack align="center" gap="xs">
            <Text>🧹 Aucune tâche active</Text>
            <Text size="sm" c="dimmed">Cliquez sur "Auto-générer" pour créer les tâches depuis les check-outs</Text>
          </Stack>
        </Card>
      ) : (
        <Stack gap="lg">
          {Object.entries(
            tasks.reduce((acc: Record<number, any[]>, task) => {
              const f = task.room.floor;
              if (!acc[f]) acc[f] = [];
              acc[f].push(task);
              return acc;
            }, {})
          )
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([floor, floorTasks]) => (
              <Card key={floor} padding="lg">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Étage {floor}</Title>
                  <Badge size="lg" color="blue">{(floorTasks as any[]).length}</Badge>
                </Group>
                <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
                  {(floorTasks as any[]).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </SimpleGrid>
              </Card>
            ))}
        </Stack>
      )}
    </Stack>
  );
}
