import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@shared/infra';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env', // Use root .env file
    }),
    CacheModule.forRoot(), // Generic cache abstraction - currently using Redis
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}

