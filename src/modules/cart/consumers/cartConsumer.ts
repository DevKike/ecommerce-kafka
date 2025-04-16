import { kafka } from '../../../core/kafka/kafkaClient';
import { CONSTANT_KAFKA } from '../../common/constants/constantsKafka';
import { Logger } from '../../../utils/logger/Logger';

export const cartConsumer = kafka.consumer({
  groupId: 'cart-service-group',
});

export const connectCartConsumer = async (): Promise<void> => {
  try {
    await cartConsumer.connect();

    await cartConsumer.subscribe({
      topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
      fromBeginning: false,
    });

    await cartConsumer.run({
      eachMessage: async ({ message }) => {
        try {
          const { value } = message;

          if (!value) return;

          const eventData = JSON.parse(value.toString());
        } catch (error) {
          Logger.error('Error processing cart event', error);
        }
      },
    });

    Logger.info('Cart consumer initialized successfully');
  } catch (error) {
    Logger.error('Error connecting cart consumer', error);
    throw error;
  }
};
