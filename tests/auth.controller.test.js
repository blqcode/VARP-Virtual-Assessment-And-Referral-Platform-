import request from 'supertest';
import app from '../server.js';
import { setupTestDB, teardownTestDB, clearDatabase } from './testUtils.js';

describe('AuthController', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          regNumber: '123456789',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.token).toBeDefined();
    });

    it('should validate input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'T',
          email: 'invalid',
          regNumber: '123',
          password: '123',
          role: 'invalid'
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      regNumber: '123456789',
      password: 'password123',
      role: 'student'
    };

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          regNumber: testUser.regNumber,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          regNumber: testUser.regNumber,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});