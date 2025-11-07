import {
  Entity,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '@shared/infra';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @Property({ type: 'varchar', length: 255 })
  firstName!: string;

  @Property({ type: 'varchar', length: 255 })
  lastName!: string;

  @Property({ type: 'varchar', length: 255 })
  @Unique()
  email!: string;

  @Property({ type: 'varchar', length: 255 })
  password!: string;

  @Property({ type: 'varchar', length: 255 })
  salt!: string;
}

