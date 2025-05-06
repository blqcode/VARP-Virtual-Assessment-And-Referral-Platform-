import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 100 * 60 * 1000, // 100 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later'
});