import mongoose from 'mongoose';
import { ICartItem, ICartItemCreate } from '../models/ICartItem';
import CartItemModel from '../models/cartItemModel';
import { NotFoundException } from '../../common/exceptions/NotFoundException';
import { IUser } from '../../auth/models/IUser';

export const cartService = {
  addToCart: async (
    userId: IUser['id'],
    cartItemData: ICartItemCreate
  ): Promise<ICartItem> => {
    try {
      const existingItem = await CartItemModel.findOne({
        userId: userId,
        productId: cartItemData.productId,
      });

      if (existingItem) {
        existingItem.quantity += cartItemData.quantity;
        return await existingItem.save();
      }

      const id = new mongoose.Types.ObjectId().toString();
      const newCartItem = new CartItemModel({
        id,
        productId: cartItemData.productId,
        quantity: cartItemData.quantity,
        addedAt: new Date().toISOString(),
        userId,
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
