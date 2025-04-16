import Joi from 'joi';

export const addToCartSchema = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const updateCartItemSchema = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});