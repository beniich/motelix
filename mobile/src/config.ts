import Constants from 'expo-constants';

export const config = {
  apiUrl: (Constants.expoConfig?.extra as any)?.apiUrl ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:5000',
  appName: 'Sapphire',
  supportEmail: 'support@sapphire.luxury',
};
