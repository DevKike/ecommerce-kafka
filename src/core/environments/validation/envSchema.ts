import Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_NAME: Joi.string().default('E-commerceKafka'),
  MONGODB_URI: Joi.string().required(),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  HASH_SALT: Joi.number().default(10),
  JWT_SECRET: Joi.string().required(),
  MAIL_SERVICE: Joi.string().valid('gmail').required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
});
