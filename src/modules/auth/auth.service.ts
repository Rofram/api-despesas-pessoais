import jwtConfig, { type JwtConfig } from '@/configs/jwt.config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';
import { OtelMethodCounter, Span } from 'nestjs-otel';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import {
  SigninDto,
  SignupDto
} from './dtos';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: JwtConfig,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  @OtelMethodCounter()
  @Span(`[${AuthService.name}] register`)
  async register(dto: SignupDto) {
    const password = await argon2.hash(dto.password);
    const user = await this.userService.create({
      ...dto,
      password,
    });
    return this.generateAccessTokens(user);
  }

  @OtelMethodCounter()
  @Span(`[${AuthService.name}] login`)
  async login(dto: SigninDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credentials Incorrect');

    const isPasswordMatch = await argon2.verify(user.password, dto.password);
    if (!isPasswordMatch) throw new UnauthorizedException('Credentials Incorrect');

    return this.generateAccessTokens(user);
  }

  @Span(`[${AuthService.name}] getAuthTokens`)
  async generateAccessTokens(user: UserEntity) {
    await this.cacheManager.set(user.id, user, 60 * 60 * 8);

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.config.accessToken.expiration,
        secret: this.config.accessToken.secret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.config.refreshToken.expiration,
        secret: this.config.refreshToken.secret,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
