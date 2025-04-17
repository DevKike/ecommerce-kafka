import { kafka } from '../../../core/kafka/kafkaClient';
import { Logger } from '../../../utils/logger/Logger';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { mailerController } from '../mailer/controllers/mailerController';

export const notificationConsumer = kafka.consumer({
  groupId: 'notifications-group',
});

export const connectNotificationsConsumer = async () => {
  try {
    await notificationConsumer.connect();
    Logger.info('Notification consumer connected');

    await notificationConsumer.subscribe({
      topics: [
        CONSTANT_KAFKA.TOPIC.USER.WELCOME_FLOW,
        CONSTANT_KAFKA.TOPIC.CART.REMOVED,
      ],
      fromBeginning: false,
    });

    await notificationConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { value } = message;

          if (!value) return;

          const eventData = JSON.parse(value.toString());

          switch (topic) {
            case CONSTANT_KAFKA.TOPIC.USER.WELCOME_FLOW:
              await mailerController.sendWelcomeEmail(eventData.payload.email, {
                name: eventData.payload.name,
              });
              break;
            case CONSTANT_KAFKA.TOPIC.CART.REMOVED:
              await mailerController.sendCartRemovalNotification(
                eventData.payload.userId
              );
              break;
            default:
              Logger.warn(`No handler for topic: ${topic}`);
              break;
          }
        } catch (error) {
          throw error;
        }
      },
    });
  } catch (error) {
    throw error;
  }
};
