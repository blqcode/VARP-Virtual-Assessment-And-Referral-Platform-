import AuthService from '../auth/services/auth.service.js';
import UserRepository from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import { setupTestDB, teardownTestDB, clearDatabase } from './testUtils.js';

describe('AuthService', () => {
  let authService;
  let userRepository;

  beforeAll(async () => {
    await setupTestDB();
    userRepository = new UserRepository();
    authService = new AuthService(userRepository);
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        regNumber: '123456789',
        password: 'password123',
        role: 'student'
      };

      const result = await authService.register(userData);
      
      expect(result.user).toHaveProperty('_id');
      expect(result.user.email).toBe(userData.email);
      expect(result.token).toBeDefined();
      expect(bcrypt.compareSync(userData.password, result.user.passwordHash)).toBeTruthy();
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        regNumber: '123456789',
        password: 'password123',
        role: 'student'
      };

      await authService.register(userData);
      await expect(authService.register(userData)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        regNumber: '123456789',
        password: 'password123',
        role: 'student'
      };

      await authService.register(userData);
      const result = await authService.login(userData.regNumber, userData.password);
      
      expect(result.user).toHaveProperty('_id');
      expect(result.token).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        regNumber: '123456789',
        password: 'password123',
        role: 'student'
      };

      await authService.register(userData);
      await expect(authService.login(userData.regNumber, 'wrongpassword')).rejects.toThrow();
    });
  });
});