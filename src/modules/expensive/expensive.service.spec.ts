import { PrismaService } from '@/database/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { ExpensiveService } from './expensive.service';

describe('ExpensiveService', () => {
  let service: ExpensiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensiveService,
        {
          provide: PrismaService,
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

    service = module.get<ExpensiveService>(ExpensiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
