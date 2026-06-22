'use client';

import { useEffect, useState } from 'react';
import { Title, Stack, Group, SimpleGrid, Card, Badge } from '@mantine/core';
import { TaskCard } from './TaskCard';
// MOCK useHousekeeping for now as we don't have the full API implementation locally
function useHousekeeping(args: any) {
  return { fetchTasks: async () => {}, loading: false };
}

export function HousekeepingBoard() {
  const [tasks, setTasks] = useState<any[]>([]);
  
  const { fetchTasks, loading } = useHousekeeping({ pageSize: 200 });
  
  useEffect(() => {
    fetchTasks().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Fetch tasks via API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/housekeeping/board', { credentials: 'include' });
        const data = await res.json();
        setTasks(data.board?.tasks ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);
  
  // Group by floor
  const byFloor = tasks.reduce((acc: Record<number, any[]>, task: any) => {
    const floor = task.room.floor;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(task);
    return acc;
  }, {} as Record<number, any[]>);
  
  const floors = Object.keys(byFloor).map(Number).sort((a, b) => a - b);
  
  return (
    <Stack gap="lg">
      {floors.map((floor) => (
        <Card key={floor} padding="lg">
          <Group justify="space-between" mb="md">
            <Title order={4}>Étage {floor}</Title>
            <Badge color="blue" size="lg">{byFloor[floor].length} tâches</Badge>
          </Group>
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
            {byFloor[floor].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SimpleGrid>
        </Card>
      ))}
    </Stack>
  );
}
