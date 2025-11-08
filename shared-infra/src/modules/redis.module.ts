import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConfig, RedisConfigOptions } from '../config/redis.config';
import { RedisService } from '../services/redis.service';
import { IRedisService } from '../services/redis.service.interface';

@Module({})
export class RedisModule {
  static forRoot(options?: RedisConfigOptions): DynamicModule {
    return {
      module: RedisModule,
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
        RedisService,
        {
          provide: 'IRedisService',
          useClass: RedisService,
        },
      ],
      exports: ['REDIS_CLIENT', 'IRedisService', RedisService],
    };
  }
}

