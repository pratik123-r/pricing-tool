import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export interface DatabaseConfigOptions {
  hostEnvKey?: string;
  portEnvKey?: string;
  userEnvKey?: string;
  passwordEnvKey?: string;
  dbNameEnvKey?: string;
  defaultHost?: string;
  defaultPort?: number;
  defaultUser?: string;
  defaultPassword?: string;
  defaultDbName?: string;
  entities: any[];
}

export const getMikroOrmConfig = (
  configService: ConfigService,
  options: DatabaseConfigOptions,
): MikroOrmModuleOptions => {
  const {
    hostEnvKey = 'DB_HOST',
    portEnvKey = 'DB_PORT',
    userEnvKey = 'DB_USER',
    passwordEnvKey = 'DB_PASSWORD',
    dbNameEnvKey = 'DB_NAME',
    defaultHost = 'localhost',
    defaultPort = 5432,
    defaultUser = 'postgres',
    defaultPassword = 'postgres',
    defaultDbName = 'app_db',
    entities,
  } = options;

  return {
    driver: PostgreSqlDriver,
    host: configService.get<string>(hostEnvKey, defaultHost),
    port: configService.get<number>(portEnvKey, defaultPort),
    user: configService.get<string>(userEnvKey, defaultUser),
    password: configService.get<string>(passwordEnvKey, defaultPassword),
    dbName: configService.get<string>(dbNameEnvKey, defaultDbName),
    entities,
    autoLoadEntities: false,
    allowGlobalContext: true, // Allow using global EntityManager instance (needed for microservices)
    migrations: {
      path: './migrations',
      glob: '!(*.d).{js,ts}',
    },
  };
};

