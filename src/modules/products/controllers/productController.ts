import mongoose from 'mongoose';
import { IProduct } from '../models/IProduct';
import { productService } from '../services/productService';
import { IEvent } from '../../common/events/interfaces/IEvent';
import { CONSTANT_KAFKA } from '../../common/constants/constants';
import { productProducer } from '../producers/productProducer';
import { Logger } from '../../../utils/logger/Logger';
import { saveEvent } from '../../common/services/eventService';

export const createProductEvent = async (product: IProduct): Promise<void> => {
  try {
    const eventId = new mongoose.Types.ObjectId();

    const productEvent: IEvent = {
      id: `evt_${eventId.toString()}`,
      timestamp: new Date().toISOString(),
      source: CONSTANT_KAFKA.SOURCE.PRODUCT_SERVICE,
      topic: CONSTANT_KAFKA.TOPIC.PRODUCT.CREATED,
      payload: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
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

    await saveEvent(productEvent);
  } catch (error) {
    Logger.error('Error creating product event', error);
  }
};

export const productController = {
  getAllProducts: async (): Promise<IProduct[]> => {
    try {
      return await productService.findAll();
    } catch (error) {
      throw error;
    }
  },
};
