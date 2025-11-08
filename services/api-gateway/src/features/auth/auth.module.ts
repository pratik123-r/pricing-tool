import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getGrpcClientConfig } from '@shared/infra';
import { AuthController } from './controllers/auth.controller';
import { AuthClientService } from './services/auth-client.service';
import { RedisService } from './services/redis.service';
import { AuthGuard } from './controllers/auth.guard';
import { AUTH_SERVICE } from './constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => {
          const port = configService.get<string>('AUTH_SERVICE_GRPC_PORT', '50051');
          const host = configService.get<string>('AUTH_SERVICE_GRPC_HOST', 'localhost');
          return getGrpcClientConfig({
            name: AUTH_SERVICE,
            package: 'auth',
            protoPath: '../auth-service/proto/auth.proto',
            url: `${host}:${port}`,
          });
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthClientService',
      useClass: AuthClientService,
    },
    {
      provide: 'IRedisService',
      useClass: RedisService,
    },
    AuthClientService,
    RedisService,
    AuthGuard,
  ],
  exports: ['IAuthClientService', RedisService, 'IRedisService', AuthGuard],
})
export class AuthModule {}

