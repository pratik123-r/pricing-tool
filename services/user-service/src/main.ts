import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { getGrpcConfig, GrpcExceptionFilter } from '@shared/infra';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { seedDefaultUserIfNeeded } from './scripts/on-startup-seed';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const configService = new ConfigService();
  const port = configService.get<string>('USER_SERVICE_GRPC_PORT', '50052');
  const host = configService.get<string>('USER_SERVICE_GRPC_HOST', '0.0.0.0');
  
  const app = await NestFactory.createMicroservice(
    AppModule,
    getGrpcConfig({
      package: 'user',
      protoPath: 'proto/user.proto',
      url: `${host}:${port}`,
    }),
  );

  app.useGlobalFilters(new GrpcExceptionFilter());

  try {
    const orm = app.get(MikroORM<PostgreSqlDriver>);
    await seedDefaultUserIfNeeded(orm);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.warn('Could not seed default user on startup', error);
  }

  await app.listen();
  const logger = new Logger('Bootstrap');
  logger.log(`User Service is running on ${host}:${port}`);
}
bootstrap();

