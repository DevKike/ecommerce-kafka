import { IProduct } from "../models/IProduct";
import { findAllProducts } from "../services/productService";

export const productController = {};

export const getAllProducts = async (): Promise<IProduct[]> => {
  return await findAllProducts();
};
