import { ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';

export * from './logging.interceptor';

const isProd = process.env.NODE_ENV === 'production';

export const appInterceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
  ...(!isProd
    ? [
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
      ]
    : []),
];
