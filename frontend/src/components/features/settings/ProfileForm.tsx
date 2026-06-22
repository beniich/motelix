'use client';

import { useState } from 'react';
import {
  Stack,
  TextInput,
  Group,
  Button,
  Card,
  Title,
  Divider,
  Text,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api, toApiError } from '@/lib/api';
// MOCK
function useAuth() {
  return { refresh: async () => {} };
}
import type { User } from '@/lib/api-client';

export function ProfileForm({ user }: { user: User }) {
  const { refresh } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const profileForm = useForm({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: '',
    },
    validate: {
      firstName: (v) => (v.trim().length >= 1 ? null : 'Prénom requis'),
      lastName: (v) => (v.trim().length >= 1 ? null : 'Nom requis'),
    },
  });
  
  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (v) => (v.length >= 1 ? null : 'Requis'),
      newPassword: (v) => (v.length >= 8 ? null : 'Min. 8 caractères'),
      confirmPassword: (v, values) => (v === values.newPassword ? null : 'Ne correspond pas'),
    },
  });
  
  const handleProfileSubmit = async (values: typeof profileForm.values) => {
    setLoadingProfile(true);
    try {
      await api.patch('/users/me/profile', values);
      await refresh();
      notifications.show({
        title: 'Profil mis à jour',
        message: 'Vos modifications sont enregistrées',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: toApiError(err).message,
        color: 'red',
      });
    } finally {
      setLoadingProfile(false);
    }
  };
  
  const handlePasswordSubmit = async (values: typeof passwordForm.values) => {
    setLoadingPassword(true);
    try {
      await api.post('/users/me/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      notifications.show({
        title: 'Mot de passe modifié',
        message: 'Vous devrez vous reconnecter',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: toApiError(err).message,
        color: 'red',
      });
    } finally {
      setLoadingPassword(false);
    }
  };
  
  return (
    <Stack gap="lg">
      {/* Profil */}
      <Card padding="lg">
        <Title order={4} mb="md">Informations personnelles</Title>
        <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Prénom"
                required
                {...profileForm.getInputProps('firstName')}
              />
              <TextInput
                label="Nom"
                required
                {...profileForm.getInputProps('lastName')}
              />
            </Group>
            <TextInput
              label="Email"
              value={user.email}
              disabled
              description="Contactez un admin pour modifier votre email"
            />
            <TextInput
              label="Téléphone"
              {...profileForm.getInputProps('phone')}
            />
            <Group justify="flex-end">
              <Button type="submit" loading={loadingProfile}>
                Enregistrer
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
      
      {/* Mot de passe */}
      <Card padding="lg">
        <Title order={4} mb="md">Mot de passe</Title>
        <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Mot de passe actuel"
              type="password"
              required
              {...passwordForm.getInputProps('currentPassword')}
            />
            <TextInput
              label="Nouveau mot de passe"
              type="password"
              required
              description="Min. 8 caractères"
              {...passwordForm.getInputProps('newPassword')}
            />
            <TextInput
              label="Confirmer le nouveau mot de passe"
              type="password"
              required
              {...passwordForm.getInputProps('confirmPassword')}
            />
            <Group justify="flex-end">
              <Button type="submit" loading={loadingPassword} color="orange">
                Changer le mot de passe
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
      
      {/* Sessions */}
      <Card padding="lg">
        <Title order={4} mb="md">Sécurité</Title>
        <Stack gap="xs">
          <Group justify="space-between">
            <div>
              <Text fw={500}>2FA (Authentification à deux facteurs)</Text>
              <Text size="sm" c="dimmed">Bientôt disponible</Text>
            </div>
            <Badge color="gray">À venir</Badge>
          </Group>
          <Divider />
          <Group justify="space-between">
            <div>
              <Text fw={500}>Dernière connexion</Text>
              <Text size="sm" c="dimmed">
                {(user as any).lastLoginAt
                  ? new Date((user as any).lastLoginAt).toLocaleString('fr-FR')
                  : 'Jamais'}
              </Text>
            </div>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}
