import { BaseRepository } from '@/interfaces/base-repository';
import { UserEntity } from '../entities/user.entity';

export abstract class IUserRepository extends BaseRepository<UserEntity> {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
