'use client';

import { useEffect, useState } from 'react';
import {
  Stack,
  TextInput,
  NumberInput,
  Textarea,
  Group,
  Button,
  Card,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api, toApiError } from '@/lib/api';
import type { Hotel } from '@/lib/api-client';

export function HotelSettingsForm({ hotel }: { hotel: Hotel }) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    initialValues: {
      name: hotel.name,
      description: hotel.description ?? '',
      address: hotel.address,
      city: hotel.city,
      postalCode: hotel.postalCode ?? '',
      country: hotel.country,
      phone: hotel.phone ?? '',
      email: hotel.email,
      stars: hotel.stars,
      category: hotel.category ?? '',
    },
  });
  
  useEffect(() => {
    form.setValues({
      name: hotel.name,
      description: hotel.description ?? '',
      address: hotel.address,
      city: hotel.city,
      postalCode: hotel.postalCode ?? '',
      country: hotel.country,
      phone: hotel.phone ?? '',
      email: hotel.email,
      stars: hotel.stars,
      category: hotel.category ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel.id]);
  
  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await api.patch('/hotels/me', values);
      notifications.show({
        title: 'Paramètres enregistrés',
        message: 'Les modifications sont effectives',
        color: 'green',
      });
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        {/* Identité */}
        <Card padding="lg">
          <Title order={4} mb="md">Identité</Title>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Nom de l'hôtel"
                required
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Catégorie"
                placeholder="Boutique, Resort, Palace..."
                {...form.getInputProps('category')}
              />
            </Group>
            
            <Textarea
              label="Description"
              rows={3}
              {...form.getInputProps('description')}
            />
            
            <Group grow>
              <NumberInput
                label="Étoiles"
                min={1}
                max={5}
                {...form.getInputProps('stars')}
              />
            </Group>
          </Stack>
        </Card>
        
        {/* Adresse */}
        <Card padding="lg">
          <Title order={4} mb="md">Adresse</Title>
          <Stack gap="md">
            <TextInput
              label="Adresse"
              required
              {...form.getInputProps('address')}
            />
            <Group grow>
              <TextInput
                label="Ville"
                required
                {...form.getInputProps('city')}
              />
              <TextInput
                label="Code postal"
                {...form.getInputProps('postalCode')}
              />
              <TextInput
                label="Pays (ISO 2)"
                required
                maxLength={2}
                {...form.getInputProps('country')}
              />
            </Group>
          </Stack>
        </Card>
        
        {/* Contact */}
        <Card padding="lg">
          <Title order={4} mb="md">Contact</Title>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Email"
                type="email"
                required
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Téléphone"
                {...form.getInputProps('phone')}
              />
            </Group>
          </Stack>
        </Card>
        
        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            Enregistrer les modifications
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
