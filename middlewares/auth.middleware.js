import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';

export const authenticate = (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing');
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];
    
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // 4. Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token'));
    }
    next(error);
  }
};