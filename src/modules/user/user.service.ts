import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Span } from 'nestjs-otel';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  get user() {
    return this.prismaService.user;
  }

  @Span(`[${UserService.name}] create`)
  async create(createUserDto: CreateUserDto) {
    const user = await this.user.create({ data: createUserDto });
    return new UserEntity(user);
  }

  @Span(`[${UserService.name}] findAll`)
  findAll() {
    return this.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Span(`[${UserService.name}] findOne`)
  async findOne(id: string) {
    const user = await this.user.findUnique({ where: { id } });
    if (user) {
      return new UserEntity(user);
    }
  }

  @Span(`[${UserService.name}] findByEmail`)
  async findByEmail(email: string) {
    const user = await this.user.findUnique({ where: { email } });
    if (user) {
      return new UserEntity(user);
    }
  }

  @Span(`[${UserService.name}] update`)
  async update(id: string, updateUserDto: Partial<User>) {
    const user = await this.user.update({
      where: { id },
      data: updateUserDto,
    });
    return new UserEntity(user);
  }

  @Span(`[${UserService.name}] remove`)
  async remove(id: string) {
    await this.user.delete({ where: { id } });
  }
}
