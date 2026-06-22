'use client';

import {
  Title,
  Stack,
  SimpleGrid,
  Card,
  Text,
  Group,
  ThemeIcon,
} from '@mantine/core';
import {
  IconBuildingSkyscraper,
  IconUsers,
  IconCreditCard,
  IconShieldLock,
} from '@tabler/icons-react';
import Link from 'next/link';

// Mock auth context for compilation
function useAuth() {
  return { user: { role: 'ADMIN' } };
}
function hasRole(user: any, ...roles: string[]) {
  return roles.includes(user?.role);
}

const SETTINGS_CARDS = [
  {
    href: '/settings/hotel',
    title: 'Hôtel',
    description: 'Nom, adresse, description, étoiles',
    icon: IconBuildingSkyscraper,
    color: 'blue',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    href: '/settings/team',
    title: 'Équipe',
    description: 'Gérer les utilisateurs et les rôles',
    icon: IconUsers,
    color: 'teal',
    roles: ['ADMIN'],
  },
  {
    href: '/settings/billing',
    title: 'Facturation',
    description: 'Plan, Stripe, historique',
    icon: IconCreditCard,
    color: 'violet',
    roles: ['ADMIN'],
  },
  {
    href: '/settings/audit',
    title: 'Audit',
    description: 'Journal de sécurité (SHA-256 chain)',
    icon: IconShieldLock,
    color: 'red',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  
  const visibleCards = SETTINGS_CARDS.filter((card) =>
    hasRole(user, ...card.roles)
  );
  
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Paramètres</Title>
        <Text size="sm" c="dimmed" mt="xs">
          Configuration de votre hôtel et de votre équipe
        </Text>
      </div>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 2 }} spacing="md">
        {visibleCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.href}
              padding="lg"
              component={Link}
              href={card.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Group>
                <ThemeIcon color={card.color} variant="light" size="xl" radius="md">
                  <Icon size={24} />
                </ThemeIcon>
                <div>
                  <Text fw={600} size="lg">{card.title}</Text>
                  <Text size="sm" c="dimmed">{card.description}</Text>
                </div>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
