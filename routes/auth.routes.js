import express from 'express';
import AuthController from '../auth/controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { roleCheck } from '../middlewares/roles.middleware.js';

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/user', authenticate, authController.getCurrentUser);

// Admin-only route example
router.get('/admin', authenticate, roleCheck(['admin']), (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

export default router;