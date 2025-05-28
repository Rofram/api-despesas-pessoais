import { UseGuards, applyDecorators } from '@nestjs/common';

import { Public } from '../decorators';
import { AccessTokenGuard } from './access-token.guard';
import { RefreshTokenGuard } from './refresh-token.guard';

type AuthGuardOptions = {
  token?: 'accessToken' | 'refreshToken';
};

const defaultOptions = {
  token: 'accessToken',
};

/**
 * If the token is accessToken, then use the AccessTokenGuard, otherwise use the
 * RefreshTokenGuard
 * @param {AuthGuardOptions | undefined} options - `token` - the type of token to use.
 * @returns A decorator function
 */
export function AuthGuard(options?: AuthGuardOptions) {
  const { token } = { ...defaultOptions, ...options };

  return token === 'accessToken'
    ? applyDecorators(UseGuards(AccessTokenGuard))
    : applyDecorators(Public(), UseGuards(RefreshTokenGuard));
}
