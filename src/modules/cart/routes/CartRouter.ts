import { Router } from 'express';
import { injectable } from 'inversify';
import { ResponseManager } from '../../common/express/response/ResponseManager';
import { cartController } from '../controllers/cartController';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';
import { middlewareSchema } from '../../../middleware/middlewareSchema';
import { addToCartSchema, updateCartItemSchema } from '../schemas/cartSchema';

@injectable()
export class CartRouter {
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {

    this.router.post(
      '/items',
      middlewareSchema(addToCartSchema),
      async (req, res) => {
        await ResponseManager.manageResponse(
          cartController.addToCart(req.body),
          res,
          'Product added to cart successfully',
          HttpStatusCode.CREATED
        );
      }
    );


    this.router.put(
      '/items',
      middlewareSchema(updateCartItemSchema),
      async (req, res) => {
        const { userId, productId, quantity } = req.body;
        await ResponseManager.manageResponse(
          cartController.updateQuantity(userId, productId, quantity),
          res,
          'Cart item updated successfully',
          HttpStatusCode.OK
        );
      }
    );

    // Eliminar un producto del carrito
    this.router.delete('/items/:userId/:productId', async (req, res) => {
      await ResponseManager.manageResponse(
        cartController.removeFromCart(req.params.userId, req.params.productId),
        res,
        'Item removed from cart successfully',
        HttpStatusCode.OK
      );
    });

   
  }

  getRouter() {
    return this.router;
  }
}