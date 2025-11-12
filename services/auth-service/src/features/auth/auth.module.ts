import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthController } from './presentation/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { PasswordHashingService } from './infrastructure/services/password-hashing.service';
import { TokenGenerationService } from './infrastructure/services/token-generation.service';
import { SessionStorageService } from './infrastructure/services/session-storage.service';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { IPasswordHashingService } from './domain/services/password-hashing.interface';
import { ITokenGenerationService } from './domain/services/token-generation.interface';
import { ISessionStorageService } from './domain/services/session-storage.interface';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IPasswordHashingService',
      useClass: PasswordHashingService,
    },
    {
      provide: 'ITokenGenerationService',
      useClass: TokenGenerationService,
    },
    {
      provide: 'ISessionStorageService',
      useClass: SessionStorageService,
    },
  ],
  exports: [LoginUseCase],
})
export class AuthModule {}
