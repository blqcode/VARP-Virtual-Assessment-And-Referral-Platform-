import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { loginLimiter } from './middlewares/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import { AppError } from './utils/errors.js';
import AuthController from './auth/controllers/auth.controller.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const authController = new AuthController();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));


// Routes
app.use('/api/auth', authRoutes);
app.post('/api/auth/login', loginLimiter, authController.login.bind(authController));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

export default app;