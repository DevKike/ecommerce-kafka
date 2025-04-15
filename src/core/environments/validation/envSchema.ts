import Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_NAME: Joi.string().default('E-commerceKafka'),
  MONGODB_USERNAME: Joi.string().required(),
  MONGODB_PASSWORD: Joi.string().required(),
  MONGODB_HOST: Joi.string().default('localhost'),
  MONGODB_PORT: Joi.number().default(27017),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  HASH_SALT: Joi.number().default(10),
  JWT_SECRET: Joi.string().required(),
});
