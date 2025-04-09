import { Application } from './app/Application';
import { container } from './modules/common/inversify/config/inversifyConfig';
import { TYPES } from './modules/common/inversify/types/inversifyTypes';

async function bootstrap() {
  try {
    const application = container.get<Application>(TYPES.Application);
    await application.init();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
