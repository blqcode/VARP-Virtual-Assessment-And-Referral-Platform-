import request from 'supertest';
import app from '../server.js';
import { setupTestDB, teardownTestDB, clearDatabase } from './testUtils.js';

describe('Authentication Integration', () => {
  let authToken;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test('Full auth flow', async () => {
    // Register
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Integration Test',
        email: 'integration@test.com',
        regNumber: '987654321',
        password: 'testpassword',
        role: 'student'
      });

    expect(registerResponse.status).toBe(201);
    authToken = registerResponse.body.token;

    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        regNumber: '987654321',
        password: 'testpassword'
      });

    expect(loginResponse.status).toBe(200);

    // Get current user
    const userResponse = await request(app)
      .get('/api/auth/user')
      .set('Authorization', `Bearer ${authToken}`);

    expect(userResponse.status).toBe(200);
    expect(userResponse.body.user.email).toBe('integration@test.com');

    // Logout
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${authToken}`);

    expect(logoutResponse.status).toBe(200);
  });
});