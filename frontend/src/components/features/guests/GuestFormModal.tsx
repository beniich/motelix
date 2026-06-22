'use client';

import {
  Modal,
  Stack,
  Group,
  TextInput,
  Select,
  Switch,
  Textarea,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { api, toApiError } from '@/lib/api';
import type { Guest } from '@/lib/api-client';

interface GuestFormModalProps {
  opened: boolean;
  onClose: () => void;
  guest?: Guest | null;
  onSuccess: () => void;
}

const NATIONALITIES = [
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'US', label: '🇺🇸 États-Unis' },
  { value: 'GB', label: '🇬🇧 Royaume-Uni' },
  { value: 'DE', label: '🇩🇪 Allemagne' },
  { value: 'ES', label: '🇪🇸 Espagne' },
  { value: 'IT', label: '🇮🇹 Italie' },
  { value: 'JP', label: '🇯🇵 Japon' },
  { value: 'CN', label: '🇨🇳 Chine' },
];

export function GuestFormModal({ opened, onClose, guest, onSuccess }: GuestFormModalProps) {
  const isEdit = !!guest;
  
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: 'FR',
      vip: false,
      loyaltyTier: '',
      preferences: '',
      allergies: '',
      marketingConsent: false,
    },
    validate: {
      firstName: (v) => (v.trim().length >= 1 ? null : 'Prénom requis'),
      lastName: (v) => (v.trim().length >= 1 ? null : 'Nom requis'),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Email invalide'),
    },
  });
  
  useEffect(() => {
    if (opened) {
      if (guest) {
        form.setValues({
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: guest.email,
          phone: guest.phone || '',
          nationality: guest.nationality || 'FR',
          vip: guest.vip || false,
          loyaltyTier: (guest as any).loyaltyTier ?? '',
          preferences: guest.preferences || '',
          allergies: '',
          marketingConsent: (guest as any).marketingConsent || false,
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, guest]);
  
  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (isEdit && guest) {
        await api.patch(`/guests/${guest.id}`, values);
        notifications.show({
          title: 'Client modifié',
          message: `${values.firstName} ${values.lastName}`,
          color: 'green',
        });
      } else {
        await api.post('/guests', values);
        notifications.show({
          title: 'Client créé',
          message: `${values.firstName} ${values.lastName}`,
          color: 'green',
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: toApiError(err).message,
        color: 'red',
      });
    }
  };
  
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? `Modifier ${guest?.firstName} ${guest?.lastName}` : 'Nouveau client'}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
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
          
          <Group grow>
            <TextInput
              label="Téléphone"
              placeholder="+33 6 12 34 56 78"
              {...form.getInputProps('phone')}
            />
            <Select
              label="Nationalité"
              data={NATIONALITIES}
              {...form.getInputProps('nationality')}
            />
          </Group>
          
          <Group grow>
            <Select
              label="Tier de fidélité"
              data={[
                { value: '', label: 'Aucun' },
                { value: 'BRONZE', label: 'Bronze' },
                { value: 'SILVER', label: 'Silver' },
                { value: 'GOLD', label: 'Gold' },
                { value: 'PLATINUM', label: 'Platinum' },
                { value: 'DIAMOND', label: 'Diamond' },
              ]}
              {...form.getInputProps('loyaltyTier')}
            />
            <Switch
              label="Client VIP"
              mt="lg"
              {...form.getInputProps('vip', { type: 'checkbox' })}
            />
          </Group>
          
          <Textarea
            label="Préférences"
            placeholder="Étage élevé, vue mer, journaux..."
            rows={2}
            {...form.getInputProps('preferences')}
          />
          
          <Textarea
            label="Allergies (données médicales sensibles)"
            placeholder="Arachides, lactose, gluten..."
            rows={2}
            {...form.getInputProps('allergies')}
          />
          
          <Switch
            label="Consentement marketing (emails promotionnels)"
            {...form.getInputProps('marketingConsent', { type: 'checkbox' })}
          />
          
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>Annuler</Button>
            <Button type="submit">{isEdit ? 'Modifier' : 'Créer'}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
