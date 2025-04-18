import mongoose from 'mongoose';
import { ICart } from './ICart';

const cartProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    addedAt: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const cartSchema = new mongoose.Schema<ICart>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    products: [cartProductSchema],
    updatedAt: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

const CartModel = mongoose.model<ICart>('Cart', cartSchema);

export default CartModel;
