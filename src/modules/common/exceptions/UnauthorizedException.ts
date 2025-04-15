import { BaseException } from './BaseException';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';

export class UnauthorizedException extends BaseException {
  public statusCode: HttpStatusCode;
  constructor(message?: string) {
    super();
    this.name = 'UnauthorizedException';
    this.message = message || 'Unauthorized access';
    this.statusCode = HttpStatusCode.UNAUTHORIZED;
  }
}
