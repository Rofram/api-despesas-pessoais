import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './app-exception.filter';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';

export * from './app-exception.filter';
export * from './prisma-exception.filter';

export const appFilters = [
  {
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: PrismaClientExceptionFilter,
  },
];
