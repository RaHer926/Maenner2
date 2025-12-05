import { describe, it, expect } from 'vitest';

describe('Authentication API', () => {
  const API_URL = 'http://localhost:3001/trpc';

  it('should register a new user', async () => {
    const response = await fetch(`${API_URL}/auth.register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'test123456',
        name: 'Test User',
        role: 'doctor',
      }),
    });

    const data = await response.json();
    console.log('Register response:', data);

    expect(response.status).toBe(200);
    expect(data.result.data).toHaveProperty('token');
    expect(data.result.data).toHaveProperty('user');
    expect(data.result.data.user.email).toContain('@example.com');
  }, 30000);

  it('should login with valid credentials', async () => {
    // First register a user
    const email = `test${Date.now()}@example.com`;
    const password = 'test123456';

    await fetch(`${API_URL}/auth.register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: 'Test User',
        role: 'doctor',
      }),
    });

    // Then login
    const response = await fetch(`${API_URL}/auth.login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log('Login response:', data);

    expect(response.status).toBe(200);
    expect(data.result.data).toHaveProperty('token');
    expect(data.result.data.user.email).toBe(email);
  }, 30000);
});
