import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'ecommerce-service',
  brokers: ['localhost:9092'],
});

