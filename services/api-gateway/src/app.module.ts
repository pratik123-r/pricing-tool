import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@shared/infra';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { AuthGuard } from './common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env', // Use root .env file
    }),
    RedisModule.forRoot(),
    AuthModule,
    UserModule,
  ],
  providers:[AuthGuard]
})
export class AppModule {}

