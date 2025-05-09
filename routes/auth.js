import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getUser } from '../controllers/authController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: { error: 'Too many login attempts, please try again after 15 minutes' }
});

// Public routes
router.post('/register', register);
router.post('/login', loginLimiter, login);

// Protected routes
router.post('/logout', authenticateJWT, logout);
router.get('/user', authenticateJWT, getUser);

export default router; 