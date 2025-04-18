import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { ResponseManager } from '../../common/express/response/ResponseManager';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';
import { paymentController } from '../controllers/paymentController';
import { verifyAuthMiddleware } from '../../../middleware/verifyAuthMiddleware';
import { middlewareSchema } from '../../../middleware/middlewareSchema';
import { paymentSchema } from '../schemas/paymentSchema';
import { IRequest } from '../../common/express/interfaces/IRequest';

@injectable()
export class PaymentRouter {
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      '/',
      verifyAuthMiddleware(),
      middlewareSchema(paymentSchema),
      async (req: IRequest, res: Response) => {
        await ResponseManager.manageResponse(
          paymentController.createPaymentEvent(req.user?.sub!, req.body),
          res,
          'Order created successfully',
          HttpStatusCode.OK
        );
      }
    );
  }

  getRouter() {
    return this.router;
  }
}
