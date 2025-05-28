import { UserEntity } from '@/modules/user/entities/user.entity';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

type UserData = keyof UserEntity;

/* A decorator that is used to get the user data from the request. */
export const GetUser = createParamDecorator(
  (data: UserData | undefined, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<{ user: UserEntity }>();

    return data ? user?.[data] : user;
  },
);
