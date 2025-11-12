import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '@shared/infra';
import { IUserRepository, CreateUserData, UpdateUserData } from '../../../domain/repositories/user.repository.interface';
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
    const ormEntity = await this.repository.findOne({ email });
    return ormEntity ? ormEntity.toDomain() : null;
  }

  async findById(id: string): Promise<User | null> {
    return super.findById(id);
  }

  async create(userData: CreateUserData): Promise<User> {
    return super.create(userData);
  }

  async update(id: string, userData: UpdateUserData): Promise<User> {
    return super.update(id, userData);
  }

  async findAll(page: number, limit: number): Promise<{ data: User[]; total: number }> {
    return super.findAll(page, limit);
  }
}
