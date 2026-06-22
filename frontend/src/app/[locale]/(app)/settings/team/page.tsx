'use client';

import { useState } from 'react';
import {
  Title,
  Stack,
  Group,
  Button,
  Card,
  TextInput,
  Select,
  Modal,
  Text,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useUsers } from '@/hooks/useUsers';
// MOCK
function useAuth() {
  return { user: { id: 'mock-id' } };
}
import { toApiError } from '@/lib/api';
import { UsersTable } from '@/components/features/settings/UsersTable';
import { UserInviteModal } from '@/components/features/settings/UserInviteModal';
import type { User, Role } from '@/lib/api-client';

export default function TeamPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [inviteOpened, setInviteOpened] = useState(false);
  const [roleChangeOpened, setRoleChangeOpened] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { users, loading, fetchUsers, updateRole, toggleActive, resetPassword, deleteUser } = useUsers({
    search: search || undefined,
    role: (roleFilter || undefined) as Role,
    pageSize: 100,
  });
  
  const handleRoleChange = (u: User) => {
    setEditingUser(u);
    setRoleChangeOpened(true);
  };
  
  const confirmRoleChange = async (newRole: Role) => {
    if (!editingUser) return;
    try {
      await updateRole(editingUser.id, newRole);
      notifications.show({
        title: 'Rôle modifié',
        message: `${editingUser.firstName} ${editingUser.lastName} est maintenant ${newRole}`,
        color: 'green',
      });
      setRoleChangeOpened(false);
      setEditingUser(null);
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: toApiError(err).message,
        color: 'red',
      });
    }
  };
  
  const handleToggleActive = (u: User) => {
    modals.openConfirmModal({
      title: `${u.isActive ? 'Désactiver' : 'Activer'} ${u.firstName} ${u.lastName} ?`,
      children: <Text size="sm">L'utilisateur {u.isActive ? 'ne pourra plus' : 'pourra à nouveau'} se connecter.</Text>,
      labels: { confirm: u.isActive ? 'Désactiver' : 'Activer', cancel: 'Annuler' },
      confirmProps: { color: u.isActive ? 'red' : 'green' },
      onConfirm: async () => {
        try {
          await toggleActive(u.id);
          notifications.show({
            title: u.isActive ? 'Utilisateur désactivé' : 'Utilisateur activé',
            message: `${u.firstName} ${u.lastName}`,
            color: 'green',
          });
        } catch (err) {
          notifications.show({
            title: 'Erreur',
            message: toApiError(err).message,
            color: 'red',
          });
        }
      },
    });
  };
  
  const handleResetPassword = (u: User) => {
    modals.openConfirmModal({
      title: `Reset le mot de passe de ${u.firstName} ${u.lastName} ?`,
      children: <Text size="sm">Un nouveau mot de passe temporaire sera généré et envoyé par email.</Text>,
      labels: { confirm: 'Reset', cancel: 'Annuler' },
      confirmProps: { color: 'orange' },
      onConfirm: async () => {
        try {
          const result = await resetPassword(u.id, true);
          notifications.show({
            title: 'Mot de passe réinitialisé',
            message: result.emailSent ? 'Email envoyé' : 'Échec envoi',
            color: 'green',
          });
        } catch (err) {
          notifications.show({
            title: 'Erreur',
            message: toApiError(err).message,
            color: 'red',
          });
        }
      },
    });
  };
  
  const handleDelete = (u: User) => {
    modals.openConfirmModal({
      title: `Supprimer ${u.firstName} ${u.lastName} ?`,
      children: <Text size="sm" c="red">⚠️ Action irréversible. Possible uniquement si l'utilisateur ne s'est jamais connecté.</Text>,
      labels: { confirm: 'Supprimer définitivement', cancel: 'Annuler' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteUser(u.id);
          notifications.show({
            title: 'Utilisateur supprimé',
            message: `${u.firstName} ${u.lastName}`,
            color: 'green',
          });
        } catch (err) {
          notifications.show({
            title: 'Erreur',
            message: toApiError(err).message,
            color: 'red',
          });
        }
      },
    });
  };
  
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Équipe</Title>
          <Text size="sm" c="dimmed" mt="xs">
            Gérer les utilisateurs et leurs permissions
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setInviteOpened(true)}>
          Inviter un utilisateur
        </Button>
      </Group>
      
      <Card padding="md">
        <Group>
          <TextInput
            placeholder="Rechercher par nom ou email..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Tous les rôles"
            data={[
              { value: '', label: 'Tous' },
              { value: 'ADMIN', label: 'Admin' },
              { value: 'MANAGER', label: 'Manager' },
              { value: 'STAFF', label: 'Staff' },
            ]}
            value={roleFilter}
            onChange={(v) => setRoleFilter(v ?? '')}
            clearable
            w={180}
          />
        </Group>
      </Card>
      
      <Card padding={0}>
        {loading ? (
          <Card padding="lg">Chargement...</Card>
        ) : (
          <UsersTable
            users={users}
            currentUserId={user!.id}
            onRoleChange={handleRoleChange}
            onToggleActive={handleToggleActive}
            onResetPassword={handleResetPassword}
            onDelete={handleDelete}
          />
        )}
      </Card>
      
      <UserInviteModal
        opened={inviteOpened}
        onClose={() => setInviteOpened(false)}
        onSuccess={fetchUsers}
      />
      
      {/* Modal changement de rôle */}
      <Modal
        opened={roleChangeOpened}
        onClose={() => setRoleChangeOpened(false)}
        title={`Changer le rôle de ${editingUser?.firstName} ${editingUser?.lastName}`}
      >
        <Stack gap="md">
          <Select
            label="Nouveau rôle"
            data={[
              { value: 'ADMIN', label: 'Administrateur' },
              { value: 'MANAGER', label: 'Manager' },
              { value: 'STAFF', label: 'Staff' },
            ]}
            defaultValue={editingUser?.role}
            onChange={(v) => v && confirmRoleChange(v as Role)}
          />
        </Stack>
      </Modal>
    </Stack>
  );
}
