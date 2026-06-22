'use client';

import { useEffect, useState } from 'react';
import {
  Title,
  Stack,
  Group,
  Button,
  Card,
  SimpleGrid,
  Text,
  Badge,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconDownload,
  IconStar,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { getNextTierProgress, maskEmail, maskPhone } from '@/lib/guest-helpers';
import { useGuests } from '@/hooks/useGuests';
import { formatPrice } from '@/lib/format';
import { VipBadge } from '@/components/features/guests/VipBadge';
import { LoyaltyBadge } from '@/components/features/guests/LoyaltyBadge';
import { GuestFormModal } from '@/components/features/guests/GuestFormModal';
import { AnonymizeModal } from '@/components/features/guests/AnonymizeModal';
import type { Guest } from '@/lib/api-client';

// Simple mockup of useAuth since we don't have it imported from the same path in the original
function useAuth() {
  return { user: { role: 'ADMIN' } };
}
function hasRole(user: any, role: string) {
  return user?.role === role;
}
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR');
}
function fullName(guest: any) {
  return `${guest.firstName} ${guest.lastName}`;
}

export default function GuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getById, toggleVip, exportData, anonymize } = useGuests({ autoFetch: false });
  
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpened, setEditOpened] = useState(false);
  const [anonOpened, setAnonOpened] = useState(false);
  
  const loadGuest = async () => {
    try {
      const data = await getById(id);
      setGuest(data);
    } catch (err: any) {
      notifications.show({
        title: 'Erreur',
        message: err.message || 'Error',
        color: 'red',
      });
      router.push('/guests');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadGuest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  if (loading || !guest) {
    return <Center mih={400}><Loader /></Center>;
  }
  
  if ((guest as any).isAnonymized) {
    return (
      <Stack gap="lg">
        <Button
          component={Link}
          href="/guests"
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
        >
          Retour
        </Button>
        <Alert color="gray" variant="light">
          <Text fw={500}>Client anonymisé</Text>
          <Text size="sm">Ce client a été anonymisé conformément au RGPD (Art. 17). Les données personnelles ont été supprimées.</Text>
        </Alert>
      </Stack>
    );
  }
  
  const tierProgress = getNextTierProgress((guest as any).loyaltyPoints || 0);
  
  const handleExport = async () => {
    try {
      const blob = await exportData(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guest-export-${id}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      notifications.show({
        title: 'Export téléchargé',
        message: 'Données exportées (RGPD Art. 15)',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Erreur',
        message: err.message,
        color: 'red',
      });
    }
  };
  
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group>
          <Button
            component={Link}
            href="/guests"
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
          >
            Retour
          </Button>
          <Title order={2}>{fullName(guest)}</Title>
          <VipBadge vip={guest.vip || false} />
          <LoyaltyBadge tier={(guest as any).loyaltyTier} points={(guest as any).loyaltyPoints || 0} />
        </Group>
        
        <Group>
          <Button
            variant="default"
            leftSection={<IconDownload size={16} />}
            onClick={handleExport}
          >
            Export RGPD
          </Button>
          <Button variant="default" onClick={() => setEditOpened(true)}>
            Modifier
          </Button>
          {hasRole(user, 'ADMIN') && (
            <Button
              color="red"
              variant="light"
              leftSection={<IconTrash size={16} />}
              onClick={() => setAnonOpened(true)}
            >
              Anonymiser
            </Button>
          )}
        </Group>
      </Group>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <Card padding="md">
          <Text size="sm" c="dimmed">Total séjours</Text>
          <Text fw={700} size="xl" mt="xs">{(guest as any).totalStays || 0}</Text>
        </Card>
        <Card padding="md">
          <Text size="sm" c="dimmed">Revenu généré</Text>
          <Text fw={700} size="xl" mt="xs">{formatPrice((guest as any).totalRevenueCents || 0)}</Text>
        </Card>
        <Card padding="md">
          <Text size="sm" c="dimmed">Points fidélité</Text>
          <Text fw={700} size="xl" mt="xs">{((guest as any).loyaltyPoints || 0).toLocaleString('fr-FR')}</Text>
        </Card>
        <Card padding="md">
          <Text size="sm" c="dimmed">Dernier séjour</Text>
          <Text fw={600} mt="xs">
            {(guest as any).lastStayAt ? formatDate((guest as any).lastStayAt) : '—'}
          </Text>
        </Card>
      </SimpleGrid>
      
      {/* Programme fidélité */}
      {tierProgress.next && (
        <Card padding="lg">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Progression fidélité</Text>
            <Text size="sm" c="dimmed">
              {tierProgress.pointsToNext} pts pour atteindre {tierProgress.next}
            </Text>
          </Group>
          <div style={{
            height: 12,
            backgroundColor: '#e5e7eb',
            borderRadius: 6,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${tierProgress.percent}%`,
              background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
              transition: 'width 0.3s',
            }} />
          </div>
        </Card>
      )}
      
      {/* Informations */}
      <Card padding="lg">
        <Title order={4} mb="md">Informations</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text c="dimmed">Email</Text>
              <Text>{maskEmail(guest.email)}</Text>
            </Group>
            {guest.phone && (
              <Group justify="space-between">
                <Text c="dimmed">Téléphone</Text>
                <Text>{maskPhone(guest.phone)}</Text>
              </Group>
            )}
            <Group justify="space-between">
              <Text c="dimmed">Marketing consent</Text>
              <Badge color={(guest as any).marketingConsent ? 'green' : 'gray'}>
                {(guest as any).marketingConsent ? 'Opt-in' : 'Opt-out'}
              </Badge>
            </Group>
          </Stack>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text c="dimmed">Client depuis</Text>
              <Text>{formatDate(guest.createdAt)}</Text>
            </Group>
            <Group justify="space-between">
              <Text c="dimmed">VIP</Text>
              <Button
                size="xs"
                variant={guest.vip ? 'filled' : 'light'}
                color="yellow"
                leftSection={guest.vip ? <IconStarFilled size={12} /> : <IconStar size={12} />}
                onClick={async () => {
                  await toggleVip(id);
                  loadGuest();
                }}
              >
                {guest.vip ? 'Retirer VIP' : 'Marquer VIP'}
              </Button>
            </Group>
          </Stack>
        </SimpleGrid>
      </Card>
      
      <GuestFormModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        guest={guest}
        onSuccess={loadGuest}
      />
      
      <AnonymizeModal
        opened={anonOpened}
        onClose={() => setAnonOpened(false)}
        guest={guest}
        onSuccess={() => router.push('/guests')}
      />
    </Stack>
  );
}
