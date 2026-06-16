import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth';

export default function Index() {
  const { user, isInitialized } = useAuth();
  
  useEffect(() => {
    if (!isInitialized) return;
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [user, isInitialized]);
  
  return null;
}
