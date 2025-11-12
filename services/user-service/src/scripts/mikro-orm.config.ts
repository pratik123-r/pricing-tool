import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { UserEntity } from '../features/user/infrastructure/persistence/entities/user.entity';

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  extensions: [Migrator],
  host: process.env.USER_SERVICE_DB_HOST || 'localhost',
  port: parseInt(process.env.USER_SERVICE_DB_PORT || '5432'),
  user: process.env.USER_SERVICE_DB_USER || 'postgres',
  password: process.env.USER_SERVICE_DB_PASSWORD || 'pratik',
  dbName: process.env.USER_SERVICE_DB_NAME || 'user_db',
  entities: [UserEntity],
  migrations: {
    path: './migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
    snapshot: true,
  },
};

export default config;

