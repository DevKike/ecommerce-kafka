import { BaseException } from './BaseException';
import { HttpStatusCode } from '../enums/HttpStatusCode';

export class NotFoundException extends BaseException {
  public statusCode: HttpStatusCode;
  constructor(message?: string) {
    super();
    this.name = 'NotFoundException';
    this.message = message || 'Resource not found';
    this.statusCode = HttpStatusCode.NOT_FOUND;
  }
}
