import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { IRedisService } from './redis.service.contract';
import { UserContext } from '../../../common/types';

@Injectable()
export class RedisService implements IRedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getUserContext(token: string): Promise<UserContext | null> {
    const key = `token:${token}`;
    const data = await this.redis.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as UserContext;
  }
}

