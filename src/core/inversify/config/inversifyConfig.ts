import { Container } from 'inversify';
import { TYPES } from '../types/inversifyTypes';
import { RouterManager } from '../../../modules/common/router/RouterManager';
import { UserRouter } from '../../../modules/auth/routes/UserRouter';
import { Application } from '../../../app/Application';

const container = new Container();

container.bind(TYPES.RouterManger).to(RouterManager);
container.bind(TYPES.UserRouter).to(UserRouter);
container.bind(TYPES.Application).to(Application);

export { container };
