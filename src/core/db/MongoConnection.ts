import mongoose from 'mongoose';
import { CONSTANT_CONFIG } from '../constants/constantsConfig';
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
      const mongoDbUri = CONSTANT_CONFIG.ENVIRONMENT.MONGODB_URI!;

      await mongoose.connect(mongoDbUri, {
        dbName: CONSTANT_CONFIG.ENVIRONMENT.DB_NAME,
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
