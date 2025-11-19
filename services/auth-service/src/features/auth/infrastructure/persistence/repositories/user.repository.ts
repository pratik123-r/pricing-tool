import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '@shared/infra';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity, User> implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    repository: EntityRepository<UserEntity>,
    em: EntityManager,
  ) {
    super(repository, em, UserEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email } as any);
  }

  async findById(id: string): Promise<User | null> {
    return super.findById(id);
  }
}

