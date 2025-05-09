import { Application } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../core/inversify/types/inversifyTypes';
import { UserRouter } from '../../../auth/routes/UserRouter';
import { ProductRouter } from '../../../products/routes/ProductRouter';
import { FactureRouter } from '../../../payments/routes/FactureRouter';
import { PaymentRouter } from '../../../payments/routes/PaymentRouter';
import { CartRouter } from '../../../cart/routes/CartRouter';

@injectable()
export class RouterManager {
  constructor(
    @inject(TYPES.UserRouter) private readonly userRouter: UserRouter,
    @inject(TYPES.ProductRouter)  private readonly productRouter: ProductRouter,
    @inject(TYPES.CartRouter) private readonly cartRouter: CartRouter,
    @inject(TYPES.PaymentRouter) private readonly paymentRouter: PaymentRouter,
    @inject(TYPES.FactureRouter) private readonly factureRouter: FactureRouter
  ) {}

  manageRoutes(app: Application): void {
    app.use('/api/users', this.userRouter.getRouter());
    app.use('/api/products', this.productRouter.getRouter());
    app.use('/api/orders', this.paymentRouter.getRouter());
    app.use('/api/facture', this.factureRouter.getRouter());
    app.use('/api/cart', this.cartRouter.getRouter());
  }
}
