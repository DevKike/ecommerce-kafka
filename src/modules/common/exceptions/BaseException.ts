import { HttpStatusCode } from '../enums/HttpStatusCode';

export abstract class BaseException extends Error {
  public statusCode: HttpStatusCode;
  constructor(message?: string) {
    super();
    this.name = 'BaseException';
    this.message = message || 'An unexpected error occurred';
    this.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  }
}
