'use client';

import { useEffect, useState } from 'react';
import { Title, Stack, Loader, Center } from '@mantine/core';
import { api } from '@/lib/api';
import { HotelSettingsForm } from '@/components/features/settings/HotelSettingsForm';
import type { Hotel } from '@/lib/api-client';

export default function HotelSettingsPage() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<{ hotel: Hotel }>('/hotels/me');
        setHotel(data.hotel);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  
  if (loading || !hotel) {
    return <Center mih={400}><Loader /></Center>;
  }
  
  return (
    <Stack gap="lg">
      <Title order={2}>Paramètres de l'hôtel</Title>
      <HotelSettingsForm hotel={hotel} />
    </Stack>
  );
}
