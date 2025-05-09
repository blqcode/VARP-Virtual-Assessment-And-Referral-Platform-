import User from '../models/User.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';

export default class UserRepository {
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictError('Email or registration number already exists');
      }
      throw error;
    }
  }

  async findByRegNumber(regNumber) {
    const user = await User.findOne({ regNumber });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async findById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}