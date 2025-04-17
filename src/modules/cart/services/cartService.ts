import mongoose from 'mongoose';
import { ICart, ICartAddProduct, ICartProduct } from '../models/ICart';
import CartModel from '../models/cartModel';
import { NotFoundException } from '../../common/exceptions/NotFoundException';
import { IUser } from '../../auth/models/IUser';
import { Logger } from '../../../utils/logger/Logger';

export const cartService = {
  addToCart: async (
    userId: IUser['id'],
    cartItemData: ICartAddProduct
  ): Promise<ICart> => {
    try {
      let cart = await CartModel.findOne({ userId });

      const now = new Date().toISOString();

      if (!cart) {
        Logger.debug(`Creando nuevo carrito para el usuario: ${userId}`);
        const id = new mongoose.Types.ObjectId().toString();
        cart = new CartModel({
          id,
          userId,
          products: [],
          updatedAt: now,
          createdAt: now,
        });
      }

      const existingProductIndex = cart.products.findIndex(
        (product) => product.productId === cartItemData.productId
      );

      if (existingProductIndex >= 0) {
        Logger.debug(
          `Actualizando cantidad de producto existente en el carrito. ProductId: ${cartItemData.productId}`
        );
        cart.products[existingProductIndex].quantity += cartItemData.quantity;
      } else {
        Logger.debug(
          `Añadiendo nuevo producto al carrito. ProductId: ${cartItemData.productId}`
        );
        const newProduct: ICartProduct = {
          productId: cartItemData.productId,
          quantity: cartItemData.quantity,
          addedAt: now,
        };
        cart.products.push(newProduct);
      }

      cart.updatedAt = now;

      return await cart.save();
    } catch (error) {
      Logger.error('Error al añadir producto al carrito:', error);
      throw error;
    }
  },

  getCartByUserId: async (userId: string): Promise<ICart | null> => {
    try {
      const cart = await CartModel.findOne({ userId });

      if (!cart || cart.products.length === 0) {
        throw new NotFoundException(
          'No se encontraron productos en el carrito'
        );
      }

      return cart;
    } catch (error) {
      throw error;
    }
  },

  getTotalCartItems: async (userId: string): Promise<number> => {
    try {
      const cart = await CartModel.findOne({ userId });
      if (!cart) return 0;

      return cart.products.reduce(
        (total, product) => total + product.quantity,
        0
      );
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (userId: string, productId: string): Promise<void> => {
    try {
      const cart = await CartModel.findOne({ userId });

      if (!cart) {
        throw new NotFoundException(
          `No se encontró el carrito para el usuario ${userId}`
        );
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId === productId
      );

      if (productIndex === -1) {
        throw new NotFoundException(
          `Producto no encontrado en el carrito del usuario ${userId}`
        );
      }

      cart.products.splice(productIndex, 1);
      cart.updatedAt = new Date().toISOString();

      await cart.save();
    } catch (error) {
      throw error;
    }
  },

  updateCartItemQuantity: async (
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ICart> => {
    try {
      const cart = await CartModel.findOne({ userId });
      if (!cart) {
        throw new NotFoundException('No se encontró el carrito');
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId === productId
      );

      if (productIndex === -1) {
        throw new NotFoundException('Producto no encontrado en el carrito');
      }

      cart.products[productIndex].quantity = quantity;
      cart.updatedAt = new Date().toISOString();

      return await cart.save();
    } catch (error) {
      throw error;
    }
  },

  clearCart: async (userId: string): Promise<void> => {
    try {
      const cart = await CartModel.findOne({ userId });

      if (cart) {
        cart.products = [];
        cart.updatedAt = new Date().toISOString();
        await cart.save();
      }
    } catch (error) {
      throw error;
    }
  },
};
