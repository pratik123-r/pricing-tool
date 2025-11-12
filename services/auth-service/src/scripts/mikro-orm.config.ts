import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UserEntity } from '../features/auth/infrastructure/persistence/entities/user.entity';

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  host: process.env.USER_SERVICE_DB_HOST || 'localhost',
  port: parseInt(process.env.USER_SERVICE_DB_PORT || '5432'),
  user: process.env.USER_SERVICE_DB_USER || 'postgres',
  password: process.env.USER_SERVICE_DB_PASSWORD || 'pratik',
  dbName: process.env.USER_SERVICE_DB_NAME || 'user_db',
  entities: [UserEntity],
};

export default config;

