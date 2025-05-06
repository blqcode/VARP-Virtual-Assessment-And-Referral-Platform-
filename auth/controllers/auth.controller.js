import AuthService from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(req, res, next) {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) throw new ValidationError(error.details[0].message);

      const { user, token } = await this.authService.register(req.body);
      res.status(201).json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) throw new ValidationError(error.details[0].message);

      const { regNumber, password } = req.body;
      const { user, token } = await this.authService.login(regNumber, password);
      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const result = await this.authService.logout(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const user = await this.authService.getCurrentUser(req.user.id);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}