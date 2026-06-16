import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:5000';

async function apiPost(path: string, body: object) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res;
}

async function apiGet(path: string, token?: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res;
}

test.describe('API health checks', () => {
  test('GET /api/health → 200 + {status: ok}', async () => {
    const res = await apiGet('/api/health');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
  });

  test('GET /api/auth/me sans token → 401', async () => {
    const res = await apiGet('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login mauvais creds → 401', async () => {
    const res = await apiPost('/api/auth/login', {
      email: 'nobody@example.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login credentials valides → 200 + token', async () => {
    const res = await apiPost('/api/auth/login', {
      email: 'admin@zafir.luxury',
      password: 'Password123!',
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.accessToken).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe('admin@zafir.luxury');
  });

  test('Route inconnue → 404 sans leak de secrets', async () => {
    const res = await apiGet('/api/__nonexistent_route__');
    expect(res.status).toBe(404);
    const text = await res.text();
    expect(text.toLowerCase()).not.toContain('password');
    expect(text.toLowerCase()).not.toContain('secret');
    expect(text.toLowerCase()).not.toContain('jwt');
  });

  test('CORS headers présents sur /api/health', async () => {
    const res = await fetch(`${API_URL}/api/health`, {
      headers: { Origin: 'http://localhost:5173' },
    });
    const acao = res.headers.get('access-control-allow-origin');
    expect(acao).toBeTruthy();
  });

  test('GET /api/reservations sans auth → 401', async () => {
    const res = await apiGet('/api/reservations');
    expect(res.status).toBe(401);
  });

  test('GET /api/reservations avec token valide → 200', async () => {
    const loginRes = await apiPost('/api/auth/login', {
      email: 'admin@zafir.luxury',
      password: 'Password123!',
    });
    const { accessToken } = await loginRes.json();
    const res = await apiGet('/api/reservations', accessToken);
    expect(res.status).toBe(200);
  });
});
