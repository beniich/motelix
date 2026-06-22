'use client';

import {
  Title,
  Stack,
  Card,
  Text,
  Group,
  Badge,
  Button,
  SimpleGrid,
  Alert,
} from '@mantine/core';
import { IconCreditCard, IconExternalLink } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function BillingSettingsPage() {
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/billing/stripe/status', {
          credentials: 'include',
        });
        const data = await response.json();
        setStripeStatus(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);
  
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Paramètres de facturation</Title>
        <Text size="sm" c="dimmed" mt="xs">
          Configuration des paiements et de Stripe
        </Text>
      </div>
      
      <Alert color="blue" variant="light">
        <Text size="sm">
          Vous êtes actuellement en plan <strong>Pro</strong> (trial).
          La facturation de votre abonnement Sapphire sera ajoutée dans une prochaine version.
        </Text>
      </Alert>
      
      <Card padding="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600} size="lg">Stripe Connect</Text>
            <Text size="sm" c="dimmed">
              Connectez votre compte Stripe pour accepter les paiements réels
            </Text>
          </div>
          {stripeStatus && (
            <Badge color={stripeStatus.connected ? 'green' : 'gray'} size="lg">
              {stripeStatus.connected ? 'Connecté' : 'Non connecté'}
            </Badge>
          )}
        </Group>
        
        {stripeStatus?.isMock && (
          <Alert color="yellow" variant="light" mb="md">
            <Text size="sm">
              ⚠️ Mode MOCK actif. Les paiements sont simulés. Configurez <code>STRIPE_SECRET_KEY</code> pour activer les paiements réels.
            </Text>
          </Alert>
        )}
        
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Card padding="md">
            <Text fw={500} mb="xs">Plan actuel</Text>
            <Badge color="blue" size="lg">Pro (Trial)</Badge>
            <Text size="xs" c="dimmed" mt="xs">Trial jusqu'au 30/12/2025</Text>
          </Card>
          <Card padding="md">
            <Text fw={500} mb="xs">Statut abonnement</Text>
            <Badge color="green" size="lg">Actif</Badge>
          </Card>
        </SimpleGrid>
        
        <Group mt="md">
          <Button
            variant="default"
            leftSection={<IconExternalLink size={16} />}
            component="a"
            href="https://dashboard.stripe.com"
            target="_blank"
          >
            Dashboard Stripe
          </Button>
          <Button leftSection={<IconCreditCard size={16} />}>
            Gérer la facturation
          </Button>
        </Group>
      </Card>
    </Stack>
  );
}
