export const CONSTANT = {
  ENVIRONMENT: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 3000,
    DB_NAME: process.env.DB_NAME,
    MONGODB_USERNAME: process.env.MONGODB_USERNAME,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    MONGODB_HOST: process.env.MONGODB_HOST || 'localhost',
    MONGODB_PORT: Number(process.env.MONGODB_PORT) || 27017,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  },

  EVENT: {
    USER: {
      REGISTERED: 'user.registered',
    },
  },
};
