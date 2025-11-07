import { BaseEntity } from '../entities/base.entity';

export interface PaginationResult<T = any> {
  data: T[];
  total: number;
}

export interface IBaseRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(page?: number, limit?: number): Promise<PaginationResult<T>>;
  create(entityData: Partial<T>): Promise<T>;
  update(id: string, entityData: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  save(entity: T): Promise<T>;
}

