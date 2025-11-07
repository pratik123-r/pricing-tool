import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { getGrpcConfig, GrpcExceptionFilter } from '@shared/infra';

async function bootstrap() {
  const configService = new ConfigService();
  const port = configService.get<string>('AUTH_SERVICE_GRPC_PORT', '50051');
  const host = configService.get<string>('AUTH_SERVICE_GRPC_HOST', '0.0.0.0');
  
  const app = await NestFactory.createMicroservice(
    AppModule,
    getGrpcConfig({
      package: 'auth',
      protoPath: 'proto/auth.proto',
      url: `${host}:${port}`,
    }),
  );

  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.listen();
  const logger = new Logger('Bootstrap');
  logger.log(`Auth Service is running on ${host}:${port}`);
}
bootstrap();

