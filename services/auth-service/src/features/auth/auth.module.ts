import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { AuthRedisService } from './services/auth-redis.service';
import { User } from './entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IPasswordService',
      useClass: PasswordService,
    },
    {
      provide: 'ITokenService',
      useClass: TokenService,
    },
    {
      provide: 'IAuthRedisService',
      useClass: AuthRedisService,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    AuthService,
    UserRepository,
    PasswordService,
    TokenService,
    AuthRedisService,
  ],
  exports: [AuthService, 'IAuthService'],
})
export class AuthModule {}

