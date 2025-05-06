import UserRepository from '../../repositories/user.repository.js';
import { generateToken, verifyToken } from '../../utils/jwt.js';
import { UnauthorizedError } from '../../utils/errors.js';

export default class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    const user = await this.userRepository.create(userData);
    const token = generateToken(user);
    return { user, token };
  }

  async login(regNumber, password) {
    const user = await this.userRepository.findByRegNumber(regNumber);
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken(user);
    return { user, token };
  }

  async getCurrentUser(userId) {
    return await this.userRepository.findById(userId);
  }

  async logout(token) {
    // In a real implementation, you might add token to a blacklist
    return { success: true };
  }
}