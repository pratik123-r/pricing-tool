import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { RedisService } from './services/redis.service';
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
      provide: 'IRedisService',
      useClass: RedisService,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    AuthService,
    UserRepository,
    PasswordService,
    TokenService,
    RedisService,
  ],
  exports: [AuthService, 'IAuthService'],
})
export class AuthModule {}

