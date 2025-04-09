import { Container } from 'inversify';
import { TYPES } from '../types/inversifyTypes';
import { RouterManager } from '../../router/RouterManager';
import { Application } from '../../../../app/Application';
import { UserRouter } from '../../../users/routes/UserRouter';

const container = new Container();

container.bind(TYPES.RouterManger).to(RouterManager);
container.bind(TYPES.UserRouter).to(UserRouter);
container.bind(TYPES.Application).to(Application);

export { container };
