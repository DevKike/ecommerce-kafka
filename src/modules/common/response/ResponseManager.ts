import { Response } from 'express';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';
import { BaseException } from '../exceptions/BaseException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { AlreadyExistException } from '../exceptions/AlreadyExistsException';

export class ResponseManager {
  constructor() {}

  public static async manageResponse(
    promise: any,
    appResponse: Response,
    message: string,
    statusCode: HttpStatusCode
  ): Promise<Response> {
    try {
      await promise;

      return appResponse.status(statusCode).json({ message });
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

    return appResponse
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error', error });
  }
}
