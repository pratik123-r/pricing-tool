import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from '../types/user-context.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

