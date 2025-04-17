import { Container } from 'inversify';
import { TYPES } from '../types/inversifyTypes';
import { RouterManager } from '../../../modules/common/express/router/RouterManager';
import { UserRouter } from '../../../modules/auth/routes/UserRouter';
import { Application } from '../../../app/Application';
import { ProductRouter } from '../../../modules/products/routes/ProductRouter';
import { PaymentRouter } from '../../../modules/payments/routes/PaymentRouter';

const container = new Container();

container.bind(TYPES.RouterManger).to(RouterManager);
container.bind(TYPES.UserRouter).to(UserRouter);
container.bind(TYPES.ProductRouter).to(ProductRouter);
container.bind(TYPES.PaymentRouter).to(PaymentRouter); 
container.bind(TYPES.Application).to(Application);

export { container };
