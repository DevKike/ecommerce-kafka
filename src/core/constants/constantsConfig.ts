export const CONSTANT_CONFIG = {
  ENVIRONMENT: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 3000,
    DB_NAME: process.env.DB_NAME || 'E-commerceKafka',
    MONGODB_USERNAME: process.env.MONGODB_USERNAME,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    MONGODB_HOST: process.env.MONGODB_HOST || 'localhost',
    MONGODB_PORT: Number(process.env.MONGODB_PORT) || 27017,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    HASH_SALT: Number(process.env.HASH_SALT) || 10,
    JWT_SECRET: process.env.JWT_SECRET,
    MAIL_SERVICE: process.env.MAIL_SERVICE,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  },
};
