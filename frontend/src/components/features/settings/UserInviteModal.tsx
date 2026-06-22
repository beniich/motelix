'use client';

import { useState } from 'react';
import {
  Modal,
  Stack,
  TextInput,
  Select,
  Switch,
  Group,
  Button,
  Alert,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api, toApiError } from '@/lib/api';
import type { Role } from '@/lib/api-client';

interface UserInviteModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserInviteModal({ opened, onClose, onSuccess }: UserInviteModalProps) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'STAFF' as Role,
      sendInvitation: true,
    },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Email invalide'),
      firstName: (v) => (v.trim().length >= 1 ? null : 'Prénom requis'),
      lastName: (v) => (v.trim().length >= 1 ? null : 'Nom requis'),
    },
  });
  
  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await api.post('/users', values);
      notifications.show({
        title: 'Utilisateur créé',
        message: values.sendInvitation
          ? `Email d'invitation envoyé à ${values.email}`
          : `${values.firstName} ${values.lastName} créé`,
        color: 'green',
      });
      onSuccess();
      onClose();
      form.reset();
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: toApiError(err).message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal opened={opened} onClose={onClose} title="Inviter un utilisateur" size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Alert color="blue" variant="light">
            <Text size="sm">
              Un email d'invitation sera envoyé avec un mot de passe temporaire si activé.
            </Text>
          </Alert>
          
          <Group grow>
            <TextInput
              label="Prénom"
              required
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Nom"
              required
              {...form.getInputProps('lastName')}
            />
          </Group>
          
          <TextInput
            label="Email"
            type="email"
            required
            {...form.getInputProps('email')}
          />
          
          <Select
            label="Rôle"
            required
            data={[
              { value: 'ADMIN', label: 'Administrateur (accès complet)' },
              { value: 'MANAGER', label: 'Manager (gestion opérationnelle)' },
              { value: 'STAFF', label: 'Staff (accès limité)' },
            ]}
            {...form.getInputProps('role')}
          />
          
          <Switch
            label="Envoyer un email d'invitation"
            description="Le mot de passe temporaire sera généré automatiquement"
            {...form.getInputProps('sendInvitation', { type: 'checkbox' })}
          />
          
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              Créer l'utilisateur
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
