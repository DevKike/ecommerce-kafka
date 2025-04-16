import { Application } from './app/Application';
import { container } from './core/inversify/config/inversifyConfig';
import { TYPES } from './core/inversify/types/inversifyTypes';

async function bootstrap() {
  try {
    const application = container.get<Application>(TYPES.Application);
    await application.init();
  } catch (error) {
    process.exit(1);
  }
}

bootstrap();
