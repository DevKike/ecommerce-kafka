import { kafka } from '../../../core/kafka/kafkaClient';
import { CONSTANT_KAFKA } from '../../common/constants/constants';
import { mailerController } from '../mailer/controllers/mailerController';

export const notificationConsumer = kafka.consumer({
  groupId: 'notifications-group',
});

export const connectNotificationsConsumer = async () => {
  try {
    await notificationConsumer.connect();

    await notificationConsumer.subscribe({
      topic: CONSTANT_KAFKA.TOPIC.USER.WELCOME_FLOW,
      fromBeginning: false,
    });

    await notificationConsumer.run({
      eachMessage: async ({ message }) => {
        try {
          const { value } = message;

          if (!value) return;

          const eventData = JSON.parse(value.toString());

          await mailerController.sendWelcomeEmail(eventData.payload.email, {
            name: eventData.payload.name,
          });
        } catch (error) {
          throw error;
        }
      },
    });
  } catch (error) {
    throw error;
  }
};
