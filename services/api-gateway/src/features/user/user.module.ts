import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getGrpcClientConfig } from '@shared/infra';
import { UserController } from './controllers/user.controller';
import { UserClientService } from './services/user-client.service';
import { AuthModule } from '../auth/auth.module';
import { USER_SERVICE } from './constants';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: USER_SERVICE,
        useFactory: (configService: ConfigService) => {
          const port = configService.get<string>('USER_SERVICE_GRPC_PORT', '50052');
          const host = configService.get<string>('USER_SERVICE_GRPC_HOST', 'localhost');
          return getGrpcClientConfig({
            name: USER_SERVICE,
            package: 'user',
            protoPath: '../user-service/proto/user.proto',
            url: `${host}:${port}`,
          });
        },
        inject: [ConfigService],
      },
    ])
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserClientService',
      useClass: UserClientService,
    },
    UserClientService,
  ],
  exports: ['IUserClientService'],
})
export class UserModule {}

