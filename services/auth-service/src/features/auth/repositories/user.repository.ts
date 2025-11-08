import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository.contract';
import { BaseRepository } from '@shared/infra';

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  protected readonly repository: EntityRepository<User>;
  protected readonly em: EntityManager;
  protected readonly entityClass = User;

  constructor(
    @InjectRepository(User)
    repository: EntityRepository<User>,
  ) {
    super();
    this.repository = repository;
    this.em = (repository as any).em;
  }

  // Business-specific method
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email });
  }
}

