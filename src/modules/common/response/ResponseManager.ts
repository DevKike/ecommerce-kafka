import { Response } from 'express';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';
import { BaseException } from '../exceptions/BaseException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { AlreadyExistException } from '../exceptions/AlreadyExistsException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

export class ResponseManager {
  constructor() {}

  public static async manageResponse(
    promise: any,
    appResponse: Response,
    message: string,
    statusCode: HttpStatusCode
  ): Promise<Response> {
    try {
      const result = await promise;

      return appResponse.status(statusCode).json({ message, data: result });
    } catch (error) {
      return await this.handleError(error as BaseException, appResponse);
    }
  }

  private static async handleError(
    error: BaseException,
    appResponse: Response
  ): Promise<Response> {
    if (error instanceof NotFoundException) {
      return appResponse
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: error.message });
    }

    if (error instanceof AlreadyExistException) {
      return appResponse
        .status(HttpStatusCode.CONFLICT)
        .json({ message: error.message });
    }

    if (error instanceof UnauthorizedException) {
      return appResponse
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: error.message });
    }

    return appResponse
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error });
  }
}
