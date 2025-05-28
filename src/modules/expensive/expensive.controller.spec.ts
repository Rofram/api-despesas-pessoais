import { PrismaService } from '@/database/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { ExpensiveController } from './expensive.controller';
import { ExpensiveService } from './expensive.service';

describe('ExpensiveController', () => {
  let controller: ExpensiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensiveController],
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

    controller = module.get<ExpensiveController>(ExpensiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
