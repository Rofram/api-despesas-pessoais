import jwtConfig, { type JwtConfig } from '@/configs/jwt.config';
import { JWT } from '@/constants';
import { JWTTokenPayload } from '@/interfaces';
import { UserService } from '@/modules/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

/* It's a Passport strategy that validates a JWT token and returns the user object */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT.REFRESH_TOKEN,
) {
  constructor(
    private readonly userService: UserService,
    @Inject(jwtConfig.KEY) private readonly config: JwtConfig,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.refreshToken.secret,
    });
  }

  async validate(payload: JWTTokenPayload) {
    let user = await this.cacheManager.get(payload.sub);
    if (user) return user;
    user = await this.userService.findOne(payload.sub);
    await this.cacheManager.set(payload.sub, user, 60 * 60 * 8);
    return user;
  }
}
