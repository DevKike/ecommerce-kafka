import { kafka } from '../../../core/kafka/kafkaClient';
import { Logger } from '../../../utils/logger/Logger';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { userService } from '../../auth/services/userService';
import { eventService } from '../../common/kafka/events/services/eventService';
import { invoiceProducer } from '../producers/invoiceProducer';
import mongoose from 'mongoose';
import { productService } from '../../products/services/productService'; // Importa el servicio de productos

export const invoiceConsumer = kafka.consumer({
  groupId: 'invoice-group',
});

export const connectInvoiceConsumer = async () => {
  await invoiceConsumer.connect();
  Logger.info('Invoice consumer connected');

  await invoiceConsumer.subscribe({
    topic: CONSTANT_KAFKA.TOPIC.INVOICE.PROCESSING,
    fromBeginning: false,
  });

  await invoiceConsumer.run({
    eachMessage: async ({ message }) => {
      try {
        const { value } = message;
        if (!value) return;
        const eventData = JSON.parse(value.toString());

        const user = await userService.findById(eventData.payload.userId);
        if (!user) {
          Logger.error('User not found for invoice');
          return;
        }

        if (Array.isArray(eventData.payload.items)) {
          for (const item of eventData.payload.items) {
            const product = await productService.findById(item.productId);
            if (!product) {
              Logger.error(`Product not found for invoice: ${item.productId}`);
              return;
            }
          }
        }

        // Obtener el total correctamente
        let total = eventData.payload.total;
        if (typeof total === 'undefined') {
          total = Array.isArray(eventData.payload.items)
            ? eventData.payload.items.reduce(
                (
                  sum: number,
                  item: { total?: number; price: number; quantity: number }
                ) => sum + (item.total ?? item.price * item.quantity),
                0
              )
            : 0;
        }

        const facturePayload = {
          to: user.email,
          subject: `Factura de tu pedido #${
            eventData.payload.orderId || eventData.id
          }`,
          content: `Total: $${total}`,
        };

        await invoiceProducer.send({
          topic: CONSTANT_KAFKA.TOPIC.NOTIFICATION.EMAIL,
          messages: [
            {
              key: eventData.id,
              value: JSON.stringify({
                ...eventData,
                topic: CONSTANT_KAFKA.TOPIC.NOTIFICATION.EMAIL,
                payload: facturePayload,
              }),
            },
          ],
        });

        await eventService.save({
          ...eventData,
          id: `evt_${new mongoose.Types.ObjectId().toString()}`,
          topic: CONSTANT_KAFKA.TOPIC.INVOICE.PROCESSING,
          payload: facturePayload,
          snapshot: {
            id: eventData.payload.userId,
            status: 'PAYED',
          },
        });
      } catch (error) {
        Logger.error('Error processing invoice event', error);
      }
    },
  });
};
