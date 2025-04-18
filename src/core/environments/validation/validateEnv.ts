import { ObjectSchema } from 'joi';
import { Logger } from '../../../utils/logger/Logger';

export const validateEnv = (schema: ObjectSchema): void => {
  const { error, value } = schema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    const errorDetails = error.details.map((detail) => detail.message);

    Logger.error(`Environment validation error: ${error.message}`);
    errorDetails.forEach((detail) => {
      Logger.error(`  - ${detail}`);
      process.exit(1);
    });
  }

  Object.keys(value).forEach((key) => {
    if (value[key] !== undefined) {
      process.env[key] = String(value[key]);
    }
  });

  Logger.info('Environment variables validated successfully');
};
