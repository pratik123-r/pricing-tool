import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from '../../features/auth/domain/value-objects/user-context.vo';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

