'use client';

import {
  Table,
  Badge,
  ActionIcon,
  Menu,
  Avatar,
  Group,
  Text,
} from '@mantine/core';
import {
  IconDots,
  IconUserShield,
  IconUserCheck,
  IconUserX,
  IconKey,
  IconTrash,
} from '@tabler/icons-react';
import type { User, Role } from '@/lib/api-client';

const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: 'red',
  ADMIN: 'blue',
  MANAGER: 'violet',
  STAFF: 'gray',
  GUEST: 'cyan',
};

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
  GUEST: 'Guest',
};

export function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

interface UsersTableProps {
  users: User[];
  currentUserId: string;
  onRoleChange: (user: User) => void;
  onToggleActive: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({
  users,
  currentUserId,
  onRoleChange,
  onToggleActive,
  onResetPassword,
  onDelete,
}: UsersTableProps) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Utilisateur</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Rôle</Table.Th>
          <Table.Th>Statut</Table.Th>
          <Table.Th>Dernière connexion</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={user.id}>
            <Table.Td>
              <Group gap="xs">
                <Avatar color={ROLE_COLORS[user.role]} radius="xl" size="sm">
                  {initials(`${user.firstName} ${user.lastName}`)}
                </Avatar>
                <div>
                  <Text fw={500}>
                    {user.firstName} {user.lastName}
                    {user.id === currentUserId && (
                      <Text component="span" size="xs" c="dimmed" ml="xs">(vous)</Text>
                    )}
                  </Text>
                </div>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">{user.email}</Text>
            </Table.Td>
            <Table.Td>
              <Badge color={ROLE_COLORS[user.role]} variant="light">
                {ROLE_LABELS[user.role]}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge color={user.isActive ? 'green' : 'gray'}>
                {user.isActive ? 'Actif' : 'Inactif'}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">
                {(user as any).lastLoginAt
                  ? new Date((user as any).lastLoginAt).toLocaleDateString('fr-FR')
                  : 'Jamais'}
              </Text>
            </Table.Td>
            <Table.Td>
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconUserShield size={14} />}
                    onClick={() => onRoleChange(user)}
                    disabled={user.id === currentUserId}
                  >
                    Changer le rôle
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconKey size={14} />}
                    onClick={() => onResetPassword(user)}
                    disabled={user.id === currentUserId}
                  >
                    Reset password
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      user.isActive ? <IconUserX size={14} /> : <IconUserCheck size={14} />
                    }
                    onClick={() => onToggleActive(user)}
                    disabled={user.id === currentUserId}
                  >
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => onDelete(user)}
                    disabled={user.id === currentUserId}
                  >
                    Supprimer
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
