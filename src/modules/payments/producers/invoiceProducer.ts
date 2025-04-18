import { Partitioners } from 'kafkajs';
import { kafka } from '../../../core/kafka/kafkaClient';

export const invoiceProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
