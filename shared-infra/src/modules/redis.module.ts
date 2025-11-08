import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConfig, RedisConfigOptions } from '../config/redis.config';
import { RedisService } from '../services/redis.service';
import { IRedisService } from '../services/redis.service.interface';

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
        {
          provide: 'IRedisService',
          useClass: RedisService,
        },
        RedisService,
      ],
      exports: ['REDIS_CLIENT', 'IRedisService', RedisService],
    };
  }
}

