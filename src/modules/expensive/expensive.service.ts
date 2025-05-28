import { PrismaService } from '@/database/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateExpensiveDto } from './dto/create-expensive.dto';
import { FindAllExpensiveFiltersDto } from './dto/find-all-expensive-filters.dto';
import { UpdateExpensiveDto } from './dto/update-expensive.dto';

@Injectable()
export class ExpensiveService {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  get expense() {
    return this.prisma.expense;
  }

  create(userId: string, createExpensiveDto: CreateExpensiveDto) {
    return this.expense.create({
      data: {
        ...createExpensiveDto,
        userId,
      },
    });
  }

  async findAllPaginated(userId: string, filters: FindAllExpensiveFiltersDto) {
    const cacheKey = `expensive:findAllPaginated:${userId}:${JSON.stringify(filters)}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const expenses = await this.expense.findMany({
      where: {
        userId,
        amount: { lte: filters.amount },
        date: { lte: filters.date },
        title: { contains: filters.title, mode: 'insensitive' },
        category: { contains: filters.category, mode: 'insensitive' },
      },
      take: filters.limit,
      skip: filters.page * filters.limit,
      orderBy: filters.sortBy && { [filters.sortBy.split('.')[0]]: filters.sortBy.split('.')[1] },
    });
    await this.cacheManager.set(cacheKey, expenses, 60 * 1000);
    return expenses;
  }

  findOne(userId: string, id: string) {
    return this.expense.findUnique({
      where: {
        id,
        userId,
      },
    });
  }

  update(userId: string, id: string, updateExpensiveDto: UpdateExpensiveDto) {
    const cacheKey = `expensive:findAllPaginated:${userId}:*`;
    this.cacheManager.del(cacheKey);
    return this.expense.update({
      where: {
        id,
        userId,
      },
      data: updateExpensiveDto,
    });
  }

  remove(userId: string, id: string) {
    const cacheKey = `expensive:findAllPaginated:${userId}:*`;
    this.cacheManager.del(cacheKey);
    return this.expense.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
