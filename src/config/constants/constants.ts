export const CONSTANT = {
  ENVIRONMENT: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 3000,
    DB_NAME: process.env.DB_NAME,
    MONGODB_URI: process.env.MONGODB_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  },
};
