import { Partitioners } from 'kafkajs';
import { kafka } from '../../../core/kafka/kafkaClient';

export const notificationProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
