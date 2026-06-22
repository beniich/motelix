'use client';

import { Title, Stack, Loader, Center } from '@mantine/core';
// MOCK
function useAuth() {
  return { user: { id: 'mock', firstName: 'Mock', lastName: 'User', email: 'mock@example.com' } as any, loading: false };
}
import { ProfileForm } from '@/components/features/settings/ProfileForm';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  
  if (loading || !user) {
    return <Center mih={400}><Loader /></Center>;
  }
  
  return (
    <Stack gap="lg">
      <Title order={2}>Mon profil</Title>
      <ProfileForm user={user} />
    </Stack>
  );
}
