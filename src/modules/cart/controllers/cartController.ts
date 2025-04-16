import mongoose from 'mongoose';
import { ICartItemCreate } from '../models/ICartItem';
import { cartService } from '../services/cartService';
import { IEvent } from '../../common/kafka/events/interfaces/IEvent';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { cartProducer } from '../producers/cartProducer';
import { Logger } from '../../../utils/logger/Logger';
import { eventService } from '../../common/kafka/events/services/eventService';
import { productService } from '../../products/services/productService';
import { NotFoundException } from '../../common/exceptions/NotFoundException';

export const cartController = {
  createCartUpdateEvent: async (cartItem: ICartItemCreate): Promise<void> => {
    try {
      const product = await productService.findById(cartItem.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${cartItem.productId} not found`);
      }

      const savedCartItem = await cartService.addToCart(cartItem);

      const totalItems = await cartService.getTotalCartItems(cartItem.userId);

      const eventId = new mongoose.Types.ObjectId();
      const cartId = new mongoose.Types.ObjectId();

      const cartEvent: IEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.CART_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
        payload: {
          userId: cartItem.userId,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          status: 'ADD',
        },
        snapshot: {
          cartId: `cart_${cartId.toString()}`,
          totalItems: totalItems,
          updatedAt: new Date().toISOString(),
        },
      };

      await cartProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
        messages: [
          {
            key: cartEvent.id,
            value: JSON.stringify(cartEvent),
          },
        ],
      });

      await eventService.save(cartEvent);
    } catch (error) {
      Logger.error('Error creating cart update event', error);
      throw error;
    }
  },

  createCartRemoveEvent: async (userId: string, productId: string): Promise<void> => {
    try {
      await cartService.removeFromCart(userId, productId);

      const totalItems = await cartService.getTotalCartItems(userId);

      const eventId = new mongoose.Types.ObjectId();
      const cartId = new mongoose.Types.ObjectId();

      const cartEvent: IEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.CART_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
        payload: {
          userId: userId,
          productId: productId,
          status: 'REMOVE',
        },
        snapshot: {
          cartId: `cart_${cartId.toString()}`,
          totalItems: totalItems,
          updatedAt: new Date().toISOString(),
        },
      };

      await cartProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
        messages: [
          {
            key: cartEvent.id,
            value: JSON.stringify(cartEvent),
          },
        ],
      });

      await eventService.save(cartEvent);
    } catch (error) {
      Logger.error('Error creating cart remove event', error);
      throw error;
    }
  },

  createCartClearEvent: async (userId: string): Promise<void> => {
    try {
      await cartService.clearCart(userId);

      const eventId = new mongoose.Types.ObjectId();
      const cartId = new mongoose.Types.ObjectId();

      const cartEvent: IEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.CART_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
        payload: {
          userId: userId,
          status: 'CLEAR',
        },
        snapshot: {
          cartId: `cart_${cartId.toString()}`,
          totalItems: 0,
          updatedAt: new Date().toISOString(),
        },
      };

      await cartProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
        messages: [
          {
            key: cartEvent.id,
            value: JSON.stringify(cartEvent),
          },
        ],
      });

      await eventService.save(cartEvent);
    } catch (error) {
      Logger.error('Error creating cart clear event', error);
      throw error;
    }
  },

  addToCart: async (cartItemData: ICartItemCreate): Promise<void> => {
    await cartController.createCartUpdateEvent(cartItemData);
  },

  getCart: async (userId: string) => {
    return await cartService.getCartByUserId(userId);
  },

  removeFromCart: async (userId: string, productId: string): Promise<void> => {
    await cartController.createCartRemoveEvent(userId, productId);
  },

  updateQuantity: async (userId: string, productId: string, quantity: number): Promise<void> => {
    await cartService.updateCartItemQuantity(userId, productId, quantity);

    const totalItems = await cartService.getTotalCartItems(userId);

    const eventId = new mongoose.Types.ObjectId();
    const cartId = new mongoose.Types.ObjectId();

    const cartEvent: IEvent = {
      id: `evt_${eventId.toString()}`,
      timestamp: new Date().toISOString(),
      source: CONSTANT_KAFKA.SOURCE.CART_SERVICE,
      topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
      payload: {
        userId: userId,
        productId: productId,
        quantity: quantity,
        status: 'UPDATE',
      },
      snapshot: {
        cartId: `cart_${cartId.toString()}`,
        totalItems: totalItems,
        updatedAt: new Date().toISOString(),
      },
    };

    await cartProducer.send({
      topic: CONSTANT_KAFKA.TOPIC.CART.UPDATED,
      messages: [{ key: cartEvent.id, value: JSON.stringify(cartEvent) }],
    });

    await eventService.save(cartEvent);
  },

  clearCart: async (userId: string): Promise<void> => {
    await cartController.createCartClearEvent(userId);
  },
};
