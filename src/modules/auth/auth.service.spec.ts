import jwtConfig from '@/configs/jwt.config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(jwtConfig)],
      providers: [
        AuthService,
        JwtService,
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
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
