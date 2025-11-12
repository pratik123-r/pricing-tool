import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getGrpcClientConfig } from '@shared/infra';
import { AuthModule } from '../auth/auth.module';
import { USER_SERVICE } from './constants';
import { UserController } from './presentation/controllers/user.controller';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserClientService } from './infrastructure/clients/user-client.service';
import { IUserClientService } from './domain/services/user-client.interface';

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
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    CreateUserUseCase,
    {
      provide: 'IUserClientService',
      useClass: UserClientService,
    },
  ],
  exports: ['IUserClientService'],
})
export class UserModule {}
