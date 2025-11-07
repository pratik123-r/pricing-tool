import { Module, DynamicModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { getMikroOrmConfig, DatabaseConfigOptions } from '../config/database.config';

@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseConfigOptions): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
      imports: [
        MikroOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => getMikroOrmConfig(configService, options),
          inject: [ConfigService],
          driver: PostgreSqlDriver,
        }),
      ],
      // MikroOrmModule is already global, so modules can use MikroOrmModule.forFeature() directly
      // No need to export it
    };
  }
}

