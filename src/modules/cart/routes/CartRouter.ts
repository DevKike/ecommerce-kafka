import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { ResponseManager } from '../../common/express/response/ResponseManager';
import { cartController } from '../controllers/cartController';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';
import { middlewareSchema } from '../../../middleware/middlewareSchema';
import { addToCartSchema } from '../schemas/cartSchema';
import { IRequest } from '../../common/express/interfaces/IRequest';
import { verifyAuthMiddleware } from '../../../middleware/verifyAuthMiddleware';

@injectable()
export class CartRouter {
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(
      '/items',
      verifyAuthMiddleware(),
      async (req: IRequest, res: Response) => {
        await ResponseManager.manageResponse(
          cartController.getCart(req.user?.sub!),
          res,
          'Cart items retrieved successfully'
        );
      }
    );

    this.router.post(
      '/items',
      verifyAuthMiddleware(),
      middlewareSchema(addToCartSchema),
      async (req: IRequest, res: Response) => {
        await ResponseManager.manageResponse(
          cartController.addToCart(req.user?.sub!, req.body),
          res,
          'Product added to cart successfully',
          HttpStatusCode.CREATED
        );
      }
    );

    this.router.delete('/items/:productId', verifyAuthMiddleware(), async (req: IRequest, res: Response) => {
      await ResponseManager.manageResponse(
      cartController.removeFromCart(req.user?.sub!, req.params.productId),
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
