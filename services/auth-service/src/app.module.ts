import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RedisModule } from '@shared/infra';
import { AuthModule } from './features/auth/auth.module';
import { User } from './features/auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env', // Use root .env file
    }),
    DatabaseModule.forRoot({
      hostEnvKey: 'USER_SERVICE_DB_HOST',
      portEnvKey: 'USER_SERVICE_DB_PORT',
      userEnvKey: 'USER_SERVICE_DB_USER',
      passwordEnvKey: 'USER_SERVICE_DB_PASSWORD',
      dbNameEnvKey: 'USER_SERVICE_DB_NAME',
      defaultHost: 'localhost',
      defaultPort: 5432,
      defaultUser: 'postgres',
      defaultPassword: 'pratik',
      defaultDbName: 'user_db',
      entities: [User],
    }),
    RedisModule.forRoot(),
    AuthModule,
  ],
})
export class AppModule {}
