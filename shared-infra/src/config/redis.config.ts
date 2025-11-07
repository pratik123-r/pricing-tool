import { ConfigService } from '@nestjs/config';

export interface RedisConfigOptions {
  hostEnvKey?: string;
  portEnvKey?: string;
  defaultHost?: string;
  defaultPort?: number;
}

export const getRedisConfig = (
  configService: ConfigService,
  options?: RedisConfigOptions,
): any => {
  const {
    hostEnvKey = 'REDIS_HOST',
    portEnvKey = 'REDIS_PORT',
    defaultHost = 'localhost',
    defaultPort = 6379,
  } = options || {};

  return {
    host: configService.get<string>(hostEnvKey, defaultHost),
    port: configService.get<number>(portEnvKey, defaultPort),
  };
};

