import { Application } from './app/Application';
import { container } from './core/inversify/config/inversifyConfig';
import { TYPES } from './core/inversify/types/inversifyTypes';
import { Logger } from './utils/logger/Logger';

async function bootstrap() {
  try {
    const application = container.get<Application>(TYPES.Application);
    await application.init();
  } catch (error) {
    Logger.error('Error during application bootstrap', error);
    process.exit(1);
  }
}

bootstrap();
