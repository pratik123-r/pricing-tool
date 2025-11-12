import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConfig, RedisConfigOptions } from '../config/redis.config';
import { RedisCacheService } from '../cache/redis-cache.service';
import { ICacheService } from '../../domain/interfaces/cache/cache.service.interface';

@Module({})
export class CacheModule {
  static forRoot(options?: RedisConfigOptions): DynamicModule {
    return {
      module: CacheModule,
      global: true,
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: (configService: ConfigService) => {
            const config = getRedisConfig(configService, options);
            return new Redis(config);
          },
          inject: [ConfigService],
        },
        RedisCacheService,
        {
          provide: 'ICacheService',
          useClass: RedisCacheService,
        },
      ],
      exports: ['REDIS_CLIENT', 'ICacheService', RedisCacheService],
    };
  }
}

