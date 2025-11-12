import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { IEntity } from '../../domain/interfaces/persistence/entity.interface';

export abstract class BaseRepository<
  TOrmEntity extends object,
  TDomainEntity extends IEntity
> {
  constructor(
    protected readonly repository: EntityRepository<TOrmEntity>,
    protected readonly em: EntityManager,
    protected readonly ormEntityClass: new () => TOrmEntity,
  ) {}

  protected toDomain(ormEntity: TOrmEntity): TDomainEntity {
    return (ormEntity as any).toDomain() as TDomainEntity;
  }

  protected fromDomain(domainData: Partial<TDomainEntity>): TOrmEntity {
    const OrmEntityClass = this.ormEntityClass as any;
    if (OrmEntityClass.fromDomain) {
      return OrmEntityClass.fromDomain(domainData);
    }
    const ormEntity = new this.ormEntityClass();
    Object.assign(ormEntity as object, domainData);
    return ormEntity;
  }

  async findById(id: string): Promise<TDomainEntity | null> {
    const ormEntity = await this.repository.findOne({ id } as any);
    return ormEntity ? this.toDomain(ormEntity) : null;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: TDomainEntity[]; total: number }> {
    const [ormEntities, total] = await this.em.findAndCount(
      this.ormEntityClass,
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );
    return {
      data: ormEntities.map(entity => this.toDomain(entity)),
      total,
    };
  }

  async create(domainData: Partial<TDomainEntity>): Promise<TDomainEntity> {
    const ormEntity = this.fromDomain(domainData);
    await this.em.persistAndFlush(ormEntity as any);
    return this.toDomain(ormEntity);
  }

  async update(id: string, domainData: Partial<TDomainEntity>): Promise<TDomainEntity> {
    const ormEntity = await this.repository.findOne({ id } as any);
    if (!ormEntity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    Object.assign(ormEntity, domainData);
    await this.em.persistAndFlush(ormEntity);
    return this.toDomain(ormEntity);
  }

  async delete(id: string): Promise<void> {
    const ormEntity = await this.repository.findOne({ id } as any);
    if (!ormEntity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    await this.em.removeAndFlush(ormEntity);
  }
}

