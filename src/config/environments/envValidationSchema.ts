import joi from 'joi';

export const envSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: joi.number().default(3000),
  MONGODB_URI: joi.string().uri().required(),
});
