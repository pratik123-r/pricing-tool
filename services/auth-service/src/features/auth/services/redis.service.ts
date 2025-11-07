import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { IRedisService } from './redis.service.contract';
import { UserContext } from '../interfaces/user-context.interface';

@Injectable()
export class RedisService implements IRedisService {
  private readonly defaultTtl = 3600; // 1 hour in seconds

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async setUserContext(
    token: string,
    userContext: UserContext,
    ttl: number = this.defaultTtl,
  ): Promise<void> {
    const key = `token:${token}`;
    await this.redis.setex(key, ttl, JSON.stringify(userContext));
  }

  async getUserContext(token: string): Promise<UserContext | null> {
    const key = `token:${token}`;
    const data = await this.redis.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as UserContext;
  }

  async deleteUserContext(token: string): Promise<void> {
    const key = `token:${token}`;
    await this.redis.del(key);
  }
}

