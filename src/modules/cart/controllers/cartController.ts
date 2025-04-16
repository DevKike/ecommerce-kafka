import mongoose from 'mongoose';
import { ICartItemCreate } from '../models/ICartItem';
import { cartService } from '../services/cartService';
import { IEvent } from '../../common/events/interfaces/IEvent';
import { CONSTANT_KAFKA } from '../../common/constants/constants';
import { cartProducer } from '../producers/cartProducer';
import { Logger } from '../../../utils/logger/Logger';
import { eventService } from '../../common/services/eventService';
import { productService } from '../../products/services/productService';
import { NotFoundException } from '../../common/exceptions/NotFoundException';

export const createCartUpdateEvent = async (cartItem: ICartItemCreate): Promise<void> => {
  try {
    // Verificar que el producto existe
    const product = await productService.findById(cartItem.productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${cartItem.productId} not found`);
    }

    // Agregar el item al carrito
    const savedCartItem = await cartService.addToCart(cartItem);
    
    // Obtener el número total de items en el carrito
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

    // Guardar el evento en la base de datos
    await eventService.save(cartEvent);
  } catch (error) {
    Logger.error('Error creating cart update event', error);
    throw error;
  }
};

export const cartController = {
  addToCart: async (cartItemData: ICartItemCreate): Promise<void> => {
    await createCartUpdateEvent(cartItemData);
  },
  
  getCart: async (userId: string) => {
    return await cartService.getCartByUserId(userId);
  },
  
  removeFromCart: async (userId: string, productId: string): Promise<void> => {
    await cartService.removeFromCart(userId, productId);
  },
  
  updateQuantity: async (userId: string, productId: string, quantity: number): Promise<void> => {
    await cartService.updateCartItemQuantity(userId, productId, quantity);
  },
  
  clearCart: async (userId: string): Promise<void> => {
    await cartService.clearCart(userId);
  }
};