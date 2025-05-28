import { CreateDtoInterface, Filter } from '@/interfaces/base-repository';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: Repository<UserEntity>,
  ) { }

  create(entity: CreateDtoInterface<UserEntity>): Promise<UserEntity> {
    return this.repository.save(entity);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  findOne(
    filter: Filter<UserEntity>,
    includes?: string[],
  ): Promise<UserEntity> {
    return this.repository.findOne({
      where: {
        ...filter.where,
      },
      relations: includes,
      order: {
        [filter.orderBy]: filter.order,
      },
    });
  }

  findMany(
    filter: Filter<UserEntity>,
    includes?: string[],
  ): Promise<UserEntity[]> {
    return this.repository.find({
      where: {
        ...filter.where,
      },
      relations: includes,
      order: {
        [filter.orderBy]: filter.order,
      },
      take: filter.limit,
      skip: filter.offset,
    });
  }

  update(id: string, entity: Partial<UserEntity>): Promise<UserEntity> {
    return this.repository.save({ ...entity, id });
  }

  delete(id: string): Promise<number> {
    return this.repository.delete(id).then((result) => result.affected);
  }
}
