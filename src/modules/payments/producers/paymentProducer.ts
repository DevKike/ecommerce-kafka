import { Partitioners } from 'kafkajs';
import { kafka } from '../../../core/kafka/kafkaClient';

export const paymentProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
