import mongoose from 'mongoose';
import { IFacture } from '../models/IFacture';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { invoiceProducer } from '../producers/invoiceProducer';
import { eventService } from '../../common/kafka/events/services/eventService';
import { Logger } from '../../../utils/logger/Logger';

export const factureController = {
  createFactureEvent: async (facture: IFacture): Promise<void> => {
    try {
      const eventId = new mongoose.Types.ObjectId();

      const factureEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.BILLING_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.NOTIFICATION.EMAIL,
        payload: {
          ...facture,
        },
        snapshot: {
          status: 'CREATED',
        },
      };
      await invoiceProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.NOTIFICATION.EMAIL,
        messages: [
          {
            key: factureEvent.id,
            value: JSON.stringify(factureEvent),
          },
        ],
      });
      await eventService.save(factureEvent);
    } catch (error) {
      Logger.error('Error creating facture event', error);
      throw error;
    }
  },
};
