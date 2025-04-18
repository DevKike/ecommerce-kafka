import { IPayment } from '../models/IPayment';
import { Logger } from '../../../utils/logger/Logger';
import mongoose from 'mongoose';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { eventService } from '../../common/kafka/events/services/eventService';
import { paymentProducer } from '../producers/paymentProducer';
import { cartService } from '../../cart/services/cartService';

export const paymentController = {
  createPaymentEvent: async (payment: IPayment): Promise<void> => {
    try {
      const eventId = new mongoose.Types.ObjectId();
      const orderId = `order_${eventId.toString()}`;

      const paymentEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.PAYMENT_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.ORDER.CREATED,
        payload: {
          ...payment,
          orderId,
        },
        snapshot: {
          id: payment.userId,
          status: 'CREATED',
        },
      };

      await paymentProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.ORDER.CREATED,
        messages: [
          {
            key: paymentEvent.id,
            value: JSON.stringify(paymentEvent),
          },
        ],
      });

      await paymentProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.INVOICE.PROCESSING,
        messages: [
          {
            key: paymentEvent.id,
            value: JSON.stringify({
              ...paymentEvent,
              topic: CONSTANT_KAFKA.TOPIC.INVOICE.PROCESSING,
            }),
          },
        ],
      });

      await eventService.save(paymentEvent);

      for (const item of payment.items) {
        await cartService.removeFromCart(payment.userId, item.productId);
      }
    } catch (error) {
      Logger.error('Error creating payment event', error);
      throw error;
    }
  },
};
