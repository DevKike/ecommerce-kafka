import { Kafka, logLevel } from 'kafkajs';
import { CONSTANT_CONFIG } from '../constants/constantsConfig';

export const kafka = new Kafka({
  clientId: CONSTANT_CONFIG.ENVIRONMENT.KAFKA_CLIENT_ID!,
  brokers: [CONSTANT_CONFIG.ENVIRONMENT.KAFKA_BROKER!],
  sasl: {
    mechanism: 'plain',
    username: CONSTANT_CONFIG.ENVIRONMENT.KAFKA_API_KEY!,
    password: CONSTANT_CONFIG.ENVIRONMENT.KAFKA_SECRET!,
  },
  ssl: true,
  // logLevel: logLevel.DEBUG,
});
