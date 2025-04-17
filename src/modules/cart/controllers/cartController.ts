import mongoose from 'mongoose';
import { ICartAddProduct } from '../models/ICart';
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
    cartItem: ICartAddProduct
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
    cartItemData: ICartAddProduct
  ): Promise<void> => {
    const product = await productService.findById(cartItemData.productId);
    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${cartItemData.productId} no encontrado`
      );
    }

    await cartService.addToCart(userId, cartItemData);
    await cartController.createCartUpdateEvent(userId, cartItemData);
  },

  getCart: async (userId: IUser['id']) => {
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

    const cart = await cartService.getCartByUserId(userId);

    if (cart) {
      const cartObject = {
        id: cart.id,
        userId: cart.userId,
        products: [] as {
          productId: string;
          quantity: number;
          addedAt: string;
          productName: string;
        }[],
        updatedAt: cart.updatedAt,
        createdAt: cart.createdAt,
      };

      // Obtener los nombres de los productos
      const productsWithNames = await Promise.all(
        cart.products.map(async (item) => {
          // Extraer solo los datos necesarios del producto
          const plainProduct = {
            productId: item.productId,
            quantity: item.quantity,
            addedAt: item.addedAt,
          };

          const product = await productService.findById(item.productId);

          return {
            ...plainProduct,
            productName: product?.name || 'Producto no encontrado',
          };
        })
      );

      cartObject.products = productsWithNames;
      return cartObject;
    }

    return null;
  },

  removeFromCart: async (
    userId: IUser['id'],
    productId: string
  ): Promise<void> => {
    try {
      const product = await productService.findById(productId);

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
          productName: product?.name,
          status: 'REMOVE',
        },
        snapshot: {
          cartId: `cart_${cartId.toString()}`,
          totalItems: totalItems,
          updatedAt: new Date().toISOString(),
        },
      };

      await cartProducer.send({
        topic: CONSTANT_KAFKA.TOPIC.CART.REMOVED,
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
