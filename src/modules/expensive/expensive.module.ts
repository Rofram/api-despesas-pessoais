import { Module } from '@nestjs/common';
import { ExpensiveService } from './expensive.service';
import { ExpensiveController } from './expensive.controller';

@Module({
  controllers: [ExpensiveController],
  providers: [ExpensiveService],
})
export class ExpensiveModule {}
