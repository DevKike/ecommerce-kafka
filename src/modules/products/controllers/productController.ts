import mongoose from 'mongoose';
import { IProduct } from '../models/IProduct';
import { productService } from '../services/productService';
import { IEvent } from '../../common/kafka/events/interfaces/IEvent';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { productProducer } from '../producers/productProducer';
import { Logger } from '../../../utils/logger/Logger';
import { eventService } from '../../common/kafka/events/services/eventService';

export const productController = {
  getAllProducts: async (): Promise<IProduct[]> => {
    try {
      return await productService.findAll();
    } catch (error) {
      throw error;
    }
  },

  createProductEvent: async (product: IProduct): Promise<void> => {
    try {
      const eventId = new mongoose.Types.ObjectId();

      const productEvent: IEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.PRODUCT_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.PRODUCT.CREATED,
        payload: {
          ...product,
        },
        snapshot: {
          id: product.id,
          status: 'CREATED',
        },
      };

      await productProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.PRODUCT.CREATED,
        messages: [
          {
            key: productEvent.id,
            value: JSON.stringify(productEvent),
          },
        ],
      });

      await productService.save(product);
      await eventService.save(productEvent);
    } catch (error) {
      Logger.error('Error creating product event', error);
      throw error;
    }
  },
};
