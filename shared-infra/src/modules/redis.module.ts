import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConfig, RedisConfigOptions } from '../config/redis.config';

@Global()
@Module({})
export class RedisModule {
  static forRoot(options?: RedisConfigOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: (configService: ConfigService) => {
            const config = getRedisConfig(configService, options);
            return new Redis(config);
          },
          inject: [ConfigService],
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }
}

