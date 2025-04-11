import { CONSTANT } from '../config/constants/constants';
import express, { Application as App } from 'express';
import { MongoConnection } from '../config/db/MongoConnection';
import { Logger } from '../utils/logger/Logger';
import { RouterManager } from '../modules/common/router/RouterManager';
import { inject, injectable } from 'inversify';
import { TYPES } from '../modules/common/inversify/types/inversifyTypes';

@injectable()
export class Application {
  private readonly app: App;
  private readonly PORT = CONSTANT.ENVIRONMENT.PORT;
  private readonly mongoConnection: MongoConnection;

  constructor(
    @inject(TYPES.RouterManger) private readonly routerManager: RouterManager
  ) {
    this.app = express();
    this.mongoConnection = MongoConnection.getInstance();
  }

  public async init(): Promise<void> {
    try {
      await this.initDatabase();
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

  private async startServer(): Promise<void> {
    this.app.listen(this.PORT, () => {
      Logger.info(`Environment: ${CONSTANT.ENVIRONMENT.NODE_ENV}`);
      Logger.info(`Server is running on http://localhost:${this.PORT}`);
    });
  }
}
