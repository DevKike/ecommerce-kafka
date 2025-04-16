import { Response } from 'express';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';
import { BaseException } from '../exceptions/BaseException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { AlreadyExistException } from '../exceptions/AlreadyExistsException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { CONSTANT_CONFIG } from '../../../core/constants/constantsConfig';

export class ResponseManager {
  constructor() {}

  public static async manageResponse(
    promise: any,
    appResponse: Response,
    message: string = 'Success',
    statusCode: HttpStatusCode = HttpStatusCode.OK
  ): Promise<Response> {
    try {
      const result = await promise;

      return appResponse.status(statusCode).json({ message, data: result });
    } catch (error) {
      return await this.handleError(error as BaseException, appResponse);
    }
  }

  private static async handleError(
    error: Error | BaseException,
    appResponse: Response
  ): Promise<Response> {
    if (error instanceof BaseException) {
      if (error instanceof NotFoundException) {
        return appResponse.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
      }

      if (error instanceof AlreadyExistException) {
        return appResponse.status(HttpStatusCode.CONFLICT).json({ message: error.message });
      }

      if (error instanceof UnauthorizedException) {
        return appResponse.status(HttpStatusCode.UNAUTHORIZED).json({ message: error.message });
      }
      return appResponse
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error', error });
    }

    return appResponse.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      error: CONSTANT_CONFIG.ENVIRONMENT.NODE_ENV
        ? undefined
        : {
            message: error.message,
            stack: error.stack,
          },
    });
  }
}
