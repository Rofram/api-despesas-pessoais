import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';

interface IRequest {
  url: string;
  method: string;
  clientIp: string;
  requestId: string;
  now: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private httpAdapter: AbstractHttpAdapter;

  constructor(
    adapter: HttpAdapterHost,
  ) {
    this.httpAdapter = adapter.httpAdapter;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<IRequest>();
    const response = ctx.getResponse();
    let message = (exception as any).message;
    let code = 'HttpException';
    let status: number;

    switch (true) {
      case exception instanceof HttpException:
        const httpError = exception as HttpException;
        status = httpError.getStatus();
        this.logError(message, httpError, request, status, request.now);
        break;
      case exception instanceof AxiosError:
        const axiosError = exception as AxiosError<{
          user: string;
          requestId: string;
        }>;
        status = axiosError.response?.status ?? 403;
        message = axiosError.message;
        code = axiosError.code;
        this.logError(message, axiosError, request, status, request.now);
        break;
      default:
        const unknownError = exception as Error;
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = unknownError.message;
        code = 'Unknown error';
        this.logError(message, unknownError, request, status, request.now);
    }

    const body = this.responseError(
      status,
      message,
      code,
      request,
      request.requestId,
    );

    this.httpAdapter.reply(response, body, status);
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

  private logError(
    message: string,
    err: Error,
    req: IRequest,
    statusCode: number,
    now: number,
  ) {
    this.logger.error(
      `[${req.method}] IP: ${req.clientIp}, URL: ${req.url
      }, STATUS: ${statusCode}, Elapsed: ${performance.now() - now
      }ms, Message: ${message} Stack: ${err.stack}`,
    );
  }
}
