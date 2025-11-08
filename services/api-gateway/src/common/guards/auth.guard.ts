import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UserContext } from '../types/user-context.interface';
import { IAuthRedisService } from '../../features/auth/services/auth-redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('IAuthRedisService')
    private readonly authRedisService: IAuthRedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const userContext = await this.authRedisService.getUserContext(token);
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

