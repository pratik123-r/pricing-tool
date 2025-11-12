import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, CacheModule } from '@shared/infra';
import { AuthModule } from './features/auth/auth.module';
import { UserEntity } from './features/auth/infrastructure/persistence/entities/user.entity';

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
      entities: [UserEntity],
    }),
    CacheModule.forRoot(), // Generic cache abstraction - currently using Redis
    AuthModule,
  ],
})
export class AppModule {}
