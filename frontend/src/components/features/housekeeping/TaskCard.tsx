'use client';

import {
  Card,
  Group,
  Text,
  Stack,
  Badge,
  Progress,
} from '@mantine/core';
import { IconClock, IconChecklist, IconAlertTriangle } from '@tabler/icons-react';
import Link from 'next/link';

interface TaskCardProps {
  task: {
    id: string;
    room: { number: string; floor: number; roomType?: { name: string } };
    type: string;
    status: string;
    priority: number;
    dueAt?: string;
    assignee?: { firstName: string; lastName: string };
    checklist?: Record<string, boolean>;
    issueReported?: boolean;
    estimatedDuration?: number;
  };
}

const TYPE_LABELS: Record<string, string> = {
  CHECKOUT_CLEAN: '🧹 Check-out',
  STAYOVER: '🛏️ Stayover',
  DEEP_CLEAN: '✨ Grand ménage',
  TURNDOWN: '🌙 Turndown',
  INSPECTION: '🔍 Inspection',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'gray',
  IN_PROGRESS: 'blue',
  COMPLETED: 'green',
  INSPECTED: 'teal',
  REJECTED: 'red',
};

const PRIORITY_COLORS: Record<number, string> = {
  1: 'gray',
  2: 'blue',
  3: 'yellow',
  4: 'orange',
  5: 'red',
};

export function TaskCard({ task }: TaskCardProps) {
  const checklistItems = task.checklist ? Object.keys(task.checklist).length : 0;
  const checklistDone = task.checklist ? Object.values(task.checklist).filter(Boolean).length : 0;
  const checklistPercent = checklistItems > 0 ? Math.round((checklistDone / checklistItems) * 100) : 0;
  
  const isOverdue = task.dueAt && new Date(task.dueAt) < new Date() && !['COMPLETED', 'INSPECTED'].includes(task.status);
  
  return (
    <Card
      padding="md"
      withBorder
      component={Link}
      href={`/housekeeping/tasks/${task.id}`}
      style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      <Stack gap="xs">
        <Group justify="space-between">
          <div>
            <Text fw={700} size="lg">
              Chambre {task.room.number}
            </Text>
            <Text size="xs" c="dimmed">{task.room.roomType?.name || 'Chambre'} · Étage {task.room.floor}</Text>
          </div>
          <Badge color={STATUS_COLORS[task.status] || 'gray'} variant="filled">
            {task.status}
          </Badge>
        </Group>
        
        <Group gap="xs">
          <Badge color="blue" variant="light">
            {TYPE_LABELS[task.type] ?? task.type}
          </Badge>
          <Badge color={PRIORITY_COLORS[task.priority] || 'gray'} variant="light">
            P{task.priority}
          </Badge>
          {isOverdue && (
            <Badge color="red" leftSection={<IconAlertTriangle size={12} />}>
              En retard
            </Badge>
          )}
          {task.issueReported && (
            <Badge color="orange">⚠ Issue</Badge>
          )}
        </Group>
        
        {checklistItems > 0 && (
          <div>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">
                <IconChecklist size={12} style={{ verticalAlign: 'middle' }} />
                {' '}{checklistDone}/{checklistItems}
              </Text>
              <Text size="xs" c="dimmed">{checklistPercent}%</Text>
            </Group>
            <Progress value={checklistPercent} size="sm" />
          </div>
        )}
        
        {task.assignee && (
          <Text size="xs" c="dimmed">
            👤 {task.assignee.firstName} {task.assignee.lastName}
          </Text>
        )}
        
        {task.dueAt && (
          <Text size="xs" c={isOverdue ? 'red' : 'dimmed'}>
            <IconClock size={12} style={{ verticalAlign: 'middle' }} />
            {' '}Échéance : {new Date(task.dueAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
