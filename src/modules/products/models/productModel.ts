import mongoose from "mongoose";
import { IProduct } from "./IProduct";

const productSchema = new mongoose.Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { versionKey: false }
);

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;
