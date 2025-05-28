import { Test, TestingModule } from '@nestjs/testing';
import { ExpensiveService } from './expensive.service';

describe('ExpensiveService', () => {
  let service: ExpensiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpensiveService],
    }).compile();

    service = module.get<ExpensiveService>(ExpensiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
