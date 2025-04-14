import { Partitioners } from 'kafkajs';
import { kafka } from '../../../core/kafka/kafkaClient';

export const userProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
