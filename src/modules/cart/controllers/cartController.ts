import mongoose from 'mongoose';
import { ICartItem, ICartItemCreate } from '../models/ICartItem';
import { cartService } from '../services/cartService';
import { IEvent } from '../../common/kafka/events/interfaces/IEvent';
import { CONSTANT_KAFKA } from '../../common/kafka/constants/constantsKafka';
import { cartProducer } from '../producers/cartProducer';
import { Logger } from '../../../utils/logger/Logger';
import { eventService } from '../../common/kafka/events/services/eventService';
import { productService } from '../../products/services/productService';
import { NotFoundException } from '../../common/exceptions/NotFoundException';
import { IUser } from '../../auth/models/IUser';

export const cartController = {
  createCartUpdateEvent: async (
    userId: IUser['id'],
    cartItem: ICartItemCreate
  ): Promise<void> => {
    try {
      const product = await productService.findById(cartItem.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${cartItem.productId} not found`
        );
      }

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

  addToCart: async (
    userId: IUser['id'],
    cartItemData: ICartItemCreate
  ): Promise<void> => {
    await cartService.addToCart(userId, cartItemData);

    await cartController.createCartUpdateEvent(userId, cartItemData);
  },

  getCart: async (userId: IUser['id']): Promise<ICartItem[]> => {
    const eventId = new mongoose.Types.ObjectId();

    const cartEvent: IEvent = {
      id: `evt_${eventId.toString()}`,
      timestamp: new Date().toISOString(),
      source: CONSTANT_KAFKA.SOURCE.CART_SERVICE,
      topic: CONSTANT_KAFKA.TOPIC.CART.CHECKOUT,
      payload: {
        userId,
        status: 'CHECKOUT',
      },
      snapshot: {
        userId,
        status: 'CHECKOUT',
        fetchAt: new Date().toISOString(),
      },
    };

    await cartProducer.send({
      topic: CONSTANT_KAFKA.TOPIC.CART.CHECKOUT,
      messages: [
        {
          key: cartEvent.id,
          value: JSON.stringify(cartEvent),
        },
      ],
    });

    await eventService.save(cartEvent);

    const itemsOnCart = await cartService.getCartByUserId(userId);

    const items: ICartItem[] = await Promise.all(
      itemsOnCart.map(async (item) => {
        const plainItem = JSON.parse(JSON.stringify(item));

        const product = await productService.findById(plainItem.productId);

        const plainItemWithProductName = {
          ...plainItem,
          productName: product?.name,
        };

        delete plainItemWithProductName._id;
        return plainItemWithProductName;
      })
    );

    return items;
  },

  removeFromCart: async (
    userId: IUser['id'],
    productId: string
  ): Promise<void> => {
    try {
      await cartService.removeFromCart(userId, productId);

      const totalItems = await cartService.getTotalCartItems(userId);

      const eventId = new mongoose.Types.ObjectId();
      const cartId = new mongoose.Types.ObjectId();

      const cartEvent: IEvent = {
        id: `evt_${eventId.toString()}`,
        timestamp: new Date().toISOString(),
        source: CONSTANT_KAFKA.SOURCE.CART_SERVICE,
        topic: CONSTANT_KAFKA.TOPIC.CART.REMOVED,
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
      Logger.error('Error removing item from cart', error);
      throw error;
    }
  },

  updateQuantity: async (
    userId: string,
    productId: string,
    quantity: number
  ): Promise<void> => {
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
};
