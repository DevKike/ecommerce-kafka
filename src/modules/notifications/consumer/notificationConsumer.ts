import { kafka } from '../../../core/kafka/kafkaClient';
import { Logger } from '../../../utils/logger/Logger';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { mailerController } from '../mailer/controllers/mailerController';
import { mailerService } from '../mailer/services/mailerService';

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
        CONSTANT_KAFKA.TOPIC.NOTIFICATION.EMAIL,
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
                eventData.payload.userId,
                {
                  productName: eventData.payload.productName,
                }
              );
              break;
            case CONSTANT_KAFKA.TOPIC.NOTIFICATION.EMAIL:
              await mailerService.sendMail(
                eventData.payload.to,
                eventData.payload.subject,
                'invoice',
                {
                  to: eventData.payload.to,
                  subject: eventData.payload.subject,
                  content: eventData.payload.content,
                  date: new Date().toLocaleDateString(),
                  year: new Date().getFullYear(),
                }
              );
              break;
            default:
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
