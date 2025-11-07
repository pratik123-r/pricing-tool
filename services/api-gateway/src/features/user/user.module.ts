import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getGrpcClientConfig } from '@shared/infra';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserClientService } from './services/user-client.service';
import { AuthModule } from '../auth/auth.module';
import { USER_SERVICE } from './constants';

@Module({
  imports: [
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
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserClientService',
      useClass: UserClientService,
    },
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    UserService,
    UserClientService,
  ],
  exports: [UserService, 'IUserService'],
})
export class UserModule {}

