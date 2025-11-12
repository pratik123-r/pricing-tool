import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { PasswordHashingService } from './infrastructure/services/password-hashing.service';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { IPasswordHashingService } from './domain/services/password-hashing.interface';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IPasswordHashingService',
      useClass: PasswordHashingService,
    },
  ],
  exports: [CreateUserUseCase, FindUserByIdUseCase, FindAllUsersUseCase, UpdateUserUseCase],
})
export class UserModule {}
