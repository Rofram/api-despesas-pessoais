import { JwtAccessStrategy, JwtRefreshStrategy } from '@/common/strategy';
import jwtConfig from '@/configs/jwt.config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(jwtConfig),
        JwtModule.register({})
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        {
          provide: UserService,
          useValue: {}
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: (key: string, value: unknown, timestamp: number) => console.log("set cache"),
            get: (key: string) => console.log("get cache")
          }
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
