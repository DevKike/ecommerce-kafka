import { Db, MongoClient } from 'mongodb';
import { CONSTANT } from '../constants/constants';
import { Logger } from '../../utils/logger/Logger';

export class MongoConnection {
  private static instance: MongoConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(uri: string): Promise<void> {
    if (this.client) {
      Logger.warn('Already connected to the database');
      return;
    }

    try {
      this.client = await MongoClient.connect(uri);
      this.db = this.client.db(CONSTANT.ENVIRONMENT.DB_NAME);
      Logger.info('Connected to the database successfully');
    } catch (error) {
      Logger.error('Error connecting to the database:', error);
      throw error;
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      Logger.info('Disconnected from the database successfully');
    }
  }
}
