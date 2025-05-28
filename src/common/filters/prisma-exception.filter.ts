import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

interface IRequest {
  ip: string;
  method: string;
  url: string;
  requestId: string;
  now: number;
}

/**
 * {@link PrismaClientExceptionFilter} catches {@link Prisma.PrismaClientKnownRequestError} and {@link Prisma.NotFoundError} exceptions.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  /**
   * default error codes mapping
   *
   * Error codes definition for Prisma Client (Query Engine)
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
   */
  private readonly errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
    P2003: HttpStatus.CONFLICT,
  };
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);
  private readonly httpAdapter: AbstractHttpAdapter;

  constructor(adapter: HttpAdapterHost) {
    this.httpAdapter = adapter.httpAdapter;
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    return this.catchClientKnownRequestError(exception, host);
  }

  /**
   * It catches the Prisma client known request errors and logs them
   * @param exception - Prisma.PrismaClientKnownRequestError
   * @param {ArgumentsHost} host - ArgumentsHost: This is the host of the current
   * request.
   * @returns The error code and message are being returned.
   */
  private catchClientKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<IRequest>();
    const response = ctx.getResponse();
    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message = this.exceptionShortMessage(exception.message);
    this.logger.error(
      `[${request.method}] IP: ${request.ip} path: ${request.url}, status: ${statusCode}, message: ${message}`,
    );
    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      const body = this.responseError(
        500,
        message,
        exception.code,
        request,
        request.requestId,
      );
      this.httpAdapter.reply(response, body, 500);
    } else {
      const body = this.responseError(
        statusCode,
        message,
        exception.code,
        request,
        request.requestId,
      );

      this.httpAdapter.reply(response, body, statusCode);
    }
  }

  /**
   * It takes a TypeScript error message and returns the part of the message that
   * is relevant to the user
   * @param {string} message - The full message of the exception.
   * @returns The exception message.
   */
  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }

  responseError(
    statusCode: number,
    message: string,
    code: string,
    request: IRequest,
    requestId: string,
  ) {
    return {
      statusCode,
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId,
    };
  }
}
