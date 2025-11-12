import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { GetUserContextUseCase } from '../../features/auth/application/use-cases/get-user-context.use-case';
import { UserContext } from '../../features/auth/domain/value-objects/user-context.vo';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly getUserContextUseCase: GetUserContextUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const userContext = await this.getUserContextUseCase.execute(token);
    if (!userContext) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = userContext;
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

