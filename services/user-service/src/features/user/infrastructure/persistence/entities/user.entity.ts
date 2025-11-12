import {
  Entity,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseOrmEntity } from '@shared/infra';
import { User } from '../../../domain/entities/user.entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseOrmEntity {
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

  toDomain(): User {
    return new User(
      this.id,
      this.firstName,
      this.lastName,
      this.email,
      this.password,
      this.salt,
      this.createdAt,
      this.updatedAt,
    );
  }

  static fromDomain(userData: { firstName: string; lastName: string; email: string; password: string; salt: string }): UserEntity {
    const ormEntity = new UserEntity();
    ormEntity.firstName = userData.firstName;
    ormEntity.lastName = userData.lastName;
    ormEntity.email = userData.email;
    ormEntity.password = userData.password;
    ormEntity.salt = userData.salt;
    return ormEntity;
  }
}

