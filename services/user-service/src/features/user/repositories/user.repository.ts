import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository.contract';
import { PaginationResult } from '@shared/infra';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly em: EntityManager;

  constructor(
    @InjectRepository(User)
    private readonly repository: EntityRepository<User>,
  ) {
    this.em = (this.repository as any).em;
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ id } as any);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginationResult<User>> {
    const [data, total] = await this.em.findAndCount(
      User,
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );
    return { data, total };
  }

  async create(entityData: Partial<User>): Promise<User> {
    const entity = this.repository.create(entityData as any);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async update(id: string, entityData: Partial<User>): Promise<User> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`User with id ${id} not found`);
    }
    Object.assign(entity, entityData);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`User with id ${id} not found`);
    }
    await this.em.removeAndFlush(entity);
  }

  async save(entity: User): Promise<User> {
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email });
  }
}

