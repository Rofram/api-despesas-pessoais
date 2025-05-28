import { Test, TestingModule } from '@nestjs/testing';
import { ExpensiveController } from './expensive.controller';
import { ExpensiveService } from './expensive.service';

describe('ExpensiveController', () => {
  let controller: ExpensiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensiveController],
      providers: [ExpensiveService],
    }).compile();

    controller = module.get<ExpensiveController>(ExpensiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
