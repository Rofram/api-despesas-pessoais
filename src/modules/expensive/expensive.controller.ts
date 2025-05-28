import { GetUser } from '@/common/decorators';
import { JWT } from '@/constants';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateExpensiveDto } from './dto/create-expensive.dto';
import { FindAllExpensiveFiltersDto } from './dto/find-all-expensive-filters.dto';
import { UpdateExpensiveDto } from './dto/update-expensive.dto';
import { ExpensiveService } from './expensive.service';

@ApiTags('Expenses')
@ApiBearerAuth(JWT.ACCESS_TOKEN)
@Controller('expenses')
export class ExpensiveController {
  constructor(private readonly expensiveService: ExpensiveService) { }

  @Post()
  create(
    @GetUser('id') userId: string,
    @Body() createExpensiveDto: CreateExpensiveDto,
  ) {
    return this.expensiveService.create(userId, createExpensiveDto);
  }

  @Get()
  findAllPaginated(
    @GetUser('id') userId: string,
    @Query() filters: FindAllExpensiveFiltersDto,
  ) {
    return this.expensiveService.findAllPaginated(userId, filters);
  }

  @Get(':id')
  findOne(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.expensiveService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateExpensiveDto: UpdateExpensiveDto,
  ) {
    return this.expensiveService.update(userId, id, updateExpensiveDto);
  }

  @Delete(':id')
  remove(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.expensiveService.remove(userId, id);
  }
}
