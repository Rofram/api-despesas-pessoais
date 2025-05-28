import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';

export * from './access-token.guard';
export * from './auth.guard';
export * from './refresh-token.guard';

export const appGuards = [
  {
    provide: APP_GUARD,
    useClass: AccessTokenGuard,
  },
];
