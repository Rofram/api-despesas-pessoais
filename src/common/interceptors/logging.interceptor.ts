import appConfig, { type AppConfig } from '@/configs/app.config';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';

interface IRequest {
  ip: string;
  method: string;
  url: string;
  now: number;
}

interface IResponse {
  statusCode: number;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(appConfig.KEY) private readonly config: AppConfig,
  ) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    if (!this.config.isDebugging) return next.handle();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<IRequest>();
    const response = ctx.getResponse<IResponse>();
    const now = performance.now();
    request.now = now;
    return next.handle().pipe(
      tap(() => {
        this.logger.debug(
          `[${request.method}] IP: ${request.ip}, PATH: ${request.url}, DURATION: ${(
            performance.now() - now
          ).toFixed(3)}ms, STATUS: ${response.statusCode}`,
        );
      }),
    );
  }
}
