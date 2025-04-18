import mongoose from 'mongoose';
import { IPayment } from './IPayment';

const paymentsSchema = new mongoose.Schema<IPayment>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { versionKey: false }
);

const PaymentsModel = mongoose.model<IPayment>('Payments', paymentsSchema);

export default PaymentsModel;
