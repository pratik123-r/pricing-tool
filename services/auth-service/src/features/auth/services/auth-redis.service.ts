import { Injectable, Inject } from '@nestjs/common';
import { IRedisService } from '@shared/infra';
import { UserContext } from '../interfaces/user-context.interface';

export interface IAuthRedisService {
  setUserContext(token: string, userContext: UserContext, ttl?: number): Promise<void>;
  getUserContext(token: string): Promise<UserContext | null>;
  deleteUserContext(token: string): Promise<void>;
}

@Injectable()
export class AuthRedisService implements IAuthRedisService {
  private readonly defaultTtl = 3600; // 1 hour in seconds

  constructor(
    @Inject('IRedisService')
    private readonly redisService: IRedisService,
  ) {}

  async setUserContext(
    token: string,
    userContext: UserContext,
    ttl: number = this.defaultTtl,
  ): Promise<void> {
    const key = `token:${token}`;
    await this.redisService.set(key, userContext, ttl);
  }

  async getUserContext(token: string): Promise<UserContext | null> {
    const key = `token:${token}`;
    return this.redisService.get<UserContext>(key);
  }

  async deleteUserContext(token: string): Promise<void> {
    const key = `token:${token}`;
    await this.redisService.delete(key);
  }
}

