export const CONSTANT_CONFIG = {
  ENVIRONMENT: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    DB_NAME: process.env.DB_NAME,
    MONGODB_URI: process.env.MONGODB_URI,
    LOG_LEVEL: process.env.LOG_LEVEL,
    HASH_SALT: Number(process.env.HASH_SALT),
    JWT_SECRET: process.env.JWT_SECRET,
    MAIL_SERVICE: process.env.MAIL_SERVICE,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_BROKER: process.env.KAFKA_BROKER,
    KAFKA_API_KEY: process.env.KAFKA_API_KEY,
    KAFKA_SECRET: process.env.KAFKA_SECRET,
  },
};
