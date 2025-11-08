import { Injectable, Inject } from '@nestjs/common';
import { IRedisService } from '@shared/infra';
import { UserContext } from '../../../common/types';

export interface IAuthRedisService {
  getUserContext(token: string): Promise<UserContext | null>;
  setUserContext(token: string, userContext: UserContext, ttlSeconds?: number): Promise<void>;
  deleteUserContext(token: string): Promise<void>;
}

@Injectable()
export class AuthRedisService implements IAuthRedisService {
  constructor(
    @Inject('IRedisService')
    private readonly redisService: IRedisService,
  ) {}

  async getUserContext(token: string): Promise<UserContext | null> {
    const key = `token:${token}`;
    return this.redisService.get<UserContext>(key);
  }

  async setUserContext(token: string, userContext: UserContext, ttlSeconds?: number): Promise<void> {
    const key = `token:${token}`;
    await this.redisService.set(key, userContext, ttlSeconds);
  }

  async deleteUserContext(token: string): Promise<void> {
    const key = `token:${token}`;
    await this.redisService.delete(key);
  }
}

