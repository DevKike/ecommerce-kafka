import mongoose from 'mongoose';
import { ICartItem, ICartItemCreate } from '../models/ICartItem';
import CartItemModel from '../models/cartItemModel';
import { NotFoundException } from '../../common/exceptions/NotFoundException';

export const cartService = {
  addToCart: async (cartItemData: ICartItemCreate): Promise<ICartItem> => {
    try {
      // Verificar si ya existe el item para el usuario
      const existingItem = await CartItemModel.findOne({
        userId: cartItemData.userId,
        productId: cartItemData.productId,
      });

      if (existingItem) {
        // Si existe, actualizar la cantidad
        existingItem.quantity += cartItemData.quantity;
        return await existingItem.save();
      }

      // Si no existe, crear nuevo item
      const id = new mongoose.Types.ObjectId().toString();
      const newCartItem = new CartItemModel({
        id: `cart_item_${id}`,
        userId: cartItemData.userId,
        productId: cartItemData.productId,
        quantity: cartItemData.quantity,
        addedAt: new Date().toISOString()
      });
      return await newCartItem.save();
      

     
    } catch (error) {
      throw error;
    }
  },

  getCartByUserId: async (userId: string): Promise<ICartItem[]> => {
    try {
      const cartItems = await CartItemModel.find({ userId });
      if (!cartItems || cartItems.length === 0) {
        return [];
      }
      return cartItems;
    } catch (error) {
      throw error;
    }
  },

  getTotalCartItems: async (userId: string): Promise<number> => {
    try {
      const cartItems = await CartItemModel.find({ userId });
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (userId: string, productId: string): Promise<void> => {
    try {
      const result = await CartItemModel.deleteOne({ userId, productId });
      if (result.deletedCount === 0) {
        throw new NotFoundException('Item not found in cart');
      }
    } catch (error) {
      throw error;
    }
  },

  updateCartItemQuantity: async (
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ICartItem> => {
    try {
      const cartItem = await CartItemModel.findOne({ userId, productId });
      if (!cartItem) {
        throw new NotFoundException('Item not found in cart');
      }

      cartItem.quantity = quantity;
      return await cartItem.save();
    } catch (error) {
      throw error;
    }
  },

  clearCart: async (userId: string): Promise<void> => {
    try {
      await CartItemModel.deleteMany({ userId });
    } catch (error) {
      throw error;
    }
  },
};