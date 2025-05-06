import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    config.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};