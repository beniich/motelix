import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'sapphire_token';
const REFRESH_KEY = 'sapphire_refresh';
const USER_KEY = 'sapphire_user';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token, {
    requireAuthentication: false,
  });
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveUser<T>(user: T) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getUser<T>(): Promise<T | null> {
  try {
    const data = await SecureStore.getItemAsync(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function clearAll() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}
