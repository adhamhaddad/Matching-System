import { UserRoles } from '@constants/user-roles.constant';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: UserRoles, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request.user;

    return user;
  },
);
