import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  regNumber: Joi.string().length(9).pattern(/^\d+$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'admin').default('student')
});

export const loginSchema = Joi.object({
  regNumber: Joi.string().length(9).pattern(/^\d+$/).required(),
  password: Joi.string().required()
});