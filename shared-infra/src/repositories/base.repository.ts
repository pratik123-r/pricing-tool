import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { BaseEntity } from '../entities/base.entity';
import { IBaseRepository, PaginationResult } from './base.repository.interface';

@Injectable()
export abstract class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {
  protected abstract readonly repository: EntityRepository<T>;
  protected abstract readonly em: EntityManager;
  protected abstract readonly entityClass: new () => T;

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ id } as any);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginationResult<T>> {
    const [data, total] = await this.em.findAndCount(
      this.entityClass,
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );
    return { data: data as T[], total };
  }

  async create(entityData: Partial<T>): Promise<T> {
    const entity = this.repository.create(entityData as any);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async update(id: string, entityData: Partial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    Object.assign(entity, entityData);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    await this.em.removeAndFlush(entity);
  }

  async save(entity: T): Promise<T> {
    await this.em.persistAndFlush(entity);
    return entity;
  }
}

