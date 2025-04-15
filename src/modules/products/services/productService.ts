import { NotFoundException } from "../../common/exceptions/NotFoundException";
import { IProduct } from "../models/IProduct";
import ProductModel from "../models/productModel";

export const findAllProducts = async (): Promise<IProduct[]> => {
  try {
    const products = await ProductModel.find();
    if (!products || products.length === 0) {
      throw new NotFoundException("No products found");
    }
    return products;
  } catch (error) {
    throw error;
  }
};

export const findProductById = async (id: string): Promise<IProduct | null> => {
  try {
    return await ProductModel.findOne({ id });
  } catch (error) {
    throw error;
  }
};
export const saveProduct = async (product: IProduct): Promise<IProduct> => {
  try {
    const newProduct = new ProductModel(product);
    return await newProduct.save();
  } catch (error) {
    throw error;
  }
};
