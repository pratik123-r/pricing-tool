import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getGrpcClientConfig } from '@shared/infra';
import { AUTH_SERVICE } from './constants/microservices.constants';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthClientService } from './infrastructure/clients/auth-client.service';
import { SessionStorageService } from './infrastructure/services/session-storage.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IAuthClientService } from './domain/services/auth-client.interface';
import { ISessionStorageService } from './domain/services/session-storage.interface';

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
    AuthGuard,
    {
      provide: 'IAuthClientService',
      useClass: AuthClientService,
    },
    {
      provide: 'ISessionStorageService',
      useClass: SessionStorageService,
    },
  ],
  exports: ['IAuthClientService', 'ISessionStorageService', AuthGuard],
})
export class AuthModule {}
