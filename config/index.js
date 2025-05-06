import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdb',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  NODE_ENV: process.env.NODE_ENV || 'development'
};