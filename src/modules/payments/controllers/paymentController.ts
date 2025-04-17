import { IPayment } from '../models/IPayment';
import { Logger } from '../../../utils/logger/Logger';
import mongoose from 'mongoose';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { eventService } from '../../common/kafka/events/services/eventService';
import { paymentProducer } from '../producers/paymentProducer';

export const paymentController = {
  createPaymentEvent: async (payment: IPayment): Promise<void> => {
    try {
      const eventId = new mongoose.Types.ObjectId();

      const paymentEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.PAYMENT_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.INVOICE.PROCESSING,
        payload: {
          ...payment,
        },
        snapshot: {
          id: payment.userId,
          status: 'CREATED',
        },
      };

      await paymentProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.PAYMENT.CREATED,
        messages: [
          {
            key: paymentEvent.id,
            value: JSON.stringify(paymentEvent),
          },
        ],
      });

      await eventService.save(paymentEvent);
    } catch (error) {
      Logger.error('Error creating payment event', error);
      throw error;
    }
  },
};
