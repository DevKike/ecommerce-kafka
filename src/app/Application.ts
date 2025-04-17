import { CONSTANT_CONFIG } from '../core/constants/constantsConfig';
import express, { Application as App } from 'express';
import { MongoConnection } from '../core/db/MongoConnection';
import { Logger } from '../utils/logger/Logger';
import { RouterManager } from '../modules/common/express/router/RouterManager';
import { inject, injectable } from 'inversify';
import { TYPES } from '../core/inversify/types/inversifyTypes';
import { userProducer } from '../modules/auth/producers/userProducer';
import { validateEnv } from '../core/environments/validation/validateEnv';
import { envSchema } from '../core/environments/validation/envSchema';
import { runSeeder } from '../modules/products/seed/runSeeder';
import { productProducer } from '../modules/products/producers/productProducer';
import { connectNotificationsConsumer } from '../modules/notifications/consumer/notificationConsumer';
import { paymentProducer } from '../modules/payments/producers/paymentProducer';

@injectable()
export class Application {
  private readonly app: App;
  private readonly PORT = CONSTANT_CONFIG.ENVIRONMENT.PORT;
  private readonly mongoConnection: MongoConnection;

  constructor(
    @inject(TYPES.RouterManger) private readonly routerManager: RouterManager
  ) {
    this.app = express();
    this.mongoConnection = MongoConnection.getInstance();
  }

  public async init(): Promise<void> {
    try {
      validateEnv(envSchema);
      await this.initDatabase();
      await this.initProducers();
      await runSeeder();
      await this.initConsumers();
      this.initMiddlewares();
      this.initRoutes();

      await this.startServer();
    } catch (error) {
      Logger.error('Error initializing application', error);
      process.exit(1);
    }
  }

  private async initDatabase(): Promise<void> {
    await this.mongoConnection.connect();
    Logger.info('Database initialized');
  }

  private initMiddlewares(): void {
    this.app.use(express.json());
    Logger.info('Middlewares initialized');
  }

  private initRoutes(): void {
    this.routerManager.manageRoutes(this.app);
    Logger.info('Routes initialized');
  }

  private async initProducers(): Promise<void> {
    await userProducer.connect();
    await productProducer.connect();
    await paymentProducer.connect();
    Logger.info('Producers initialized');
  }

  private async initConsumers(): Promise<void> {
    await connectNotificationsConsumer();
    Logger.info('Consumers initialized');
  }

  private async startServer(): Promise<void> {
    this.app.listen(this.PORT, () => {
      Logger.info(`Environment: ${CONSTANT_CONFIG.ENVIRONMENT.NODE_ENV}`);
      Logger.info(`Server is running on http://localhost:${this.PORT}`);
    });
  }
}
