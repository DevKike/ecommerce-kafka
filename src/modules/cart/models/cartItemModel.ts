import mongoose from 'mongoose';
import { ICartItem } from './ICartItem';

const cartItemSchema = new mongoose.Schema<ICartItem>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    addedAt: { type: String, required: true }
  },
  { versionKey: false }
);

// Índice compuesto para evitar duplicados de usuario-producto
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

const CartItemModel = mongoose.model<ICartItem>('CartItem', cartItemSchema);

export default CartItemModel;