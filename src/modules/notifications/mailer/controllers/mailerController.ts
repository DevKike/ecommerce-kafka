import mongoose from 'mongoose';
import { IEvent } from '../../../common/kafka/events/interfaces/IEvent';
import { eventService } from '../../../common/kafka/events/services/eventService';
import { Templates } from '../../../common/templates/enums/templatesEnum';
import { mailerService } from '../services/mailerService';
import { CONSTANT_KAFKA } from '../../../common/kafka/constants/constantsKafka';

export const mailerController = {
  sendWelcomeEmail: async (email: string, context?: Record<string, any>) => {
    try {
      await mailerService.sendMail(email, 'Welcome to E-commerce', Templates.WELCOME, {
        name: context!.name,
      });

      const eventId = new mongoose.Types.ObjectId();

      const eventData: IEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.NOTIFICATION_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.NOTIFICATION.EMAIL,
        payload: {
          to: email,
          subject: `Bienvenido a nuestro Ecommerce`,
          content: `Bienvenido a nuestro Ecommerce, ${
            context!.name
          }, Hola. Gracias por registrarte en nuestra tienda en línea...`,
        },
        snapshot: {
          status: 'SENT',
        },
      };

      await eventService.save(eventData);
    } catch (error) {
      throw error;
    }
  },
};
