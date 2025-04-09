import mongoose from 'mongoose';
import { CONSTANT } from '../constants/constants';
import { Logger } from '../../utils/logger/Logger';

export class MongoConnection {
  private static instance: MongoConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      Logger.warn('Already connected to the database');
      return;
    }

    try {
      const username = CONSTANT.ENVIRONMENT.MONGODB_USERNAME;
      const password = CONSTANT.ENVIRONMENT.MONGODB_PASSWORD;
      const host = CONSTANT.ENVIRONMENT.MONGODB_HOST;
      const port = CONSTANT.ENVIRONMENT.MONGODB_PORT;
      const dbName = CONSTANT.ENVIRONMENT.DB_NAME;

      const mongoUri = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;

      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      Logger.info('Connected to the database successfully');
    } catch (error) {
      Logger.error('Error connecting to the database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      Logger.info('Disconnected from MongoDB successfully');
    } catch (error) {
      Logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}
