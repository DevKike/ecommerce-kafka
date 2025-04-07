import { CONSTANT } from '../config/constants/constants';
import express, { Application as App } from 'express';
import { MongoConnection } from '../config/db/MongoConnection';
import { Logger } from '../utils/logger/Logger';

export class Application {
  private readonly app: App;
  private readonly PORT = CONSTANT.ENVIRONMENT.PORT;
  private readonly mongoConnection: MongoConnection;

  constructor() {
    this.app = express();
    this.mongoConnection = MongoConnection.getInstance();
    this.initMiddlewares();
    this.initRoutes();
  }

  public async initServer(): Promise<void> {
    try {
      await this.initDatabase();

      this.app.listen(this.PORT, () => {
        Logger.info(`Environment: ${CONSTANT.ENVIRONMENT.NODE_ENV}`);
        Logger.info(`Server is running on http://localhost:${this.PORT}`);
      });
    } catch (error) {
      Logger.error('Error initializing server', error);
      process.exit(1);
    }
  }
  private async initDatabase(): Promise<void> {
    await this.mongoConnection.connect(CONSTANT.ENVIRONMENT.MONGODB_URI!);
  }

  private initMiddlewares(): void {
    this.app.use(express.json());
  }

  private initRoutes(): void {}
}
