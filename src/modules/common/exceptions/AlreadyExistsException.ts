import { BaseException } from './BaseException';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';

export class AlreadyExistException extends BaseException {
  public statusCode: HttpStatusCode;
  constructor(message?: string) {
    super();
    this.name = 'AlreadyExistException';
    this.message = message || 'Resource already exists';
    this.statusCode = HttpStatusCode.CONFLICT;
  }
}
