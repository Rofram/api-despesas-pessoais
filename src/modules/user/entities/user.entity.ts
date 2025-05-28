import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  @Exclude()
  id: string;
  @ApiProperty()
  @Exclude()
  createdAt: Date;
  @ApiProperty()
  @Exclude()
  updatedAt: Date;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
