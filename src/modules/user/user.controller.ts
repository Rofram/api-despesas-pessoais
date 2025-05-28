import { GetUser } from '@/common/decorators';
import { JWT } from '@/constants';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth(JWT.ACCESS_TOKEN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: UserEntity })
  async getUser(@GetUser() user: User) {
    return new UserEntity(user);
  }
}
