import { Injectable, Inject } from '@nestjs/common';
import { ICacheService } from '@shared/infra';
import { ISessionStorageService } from '../../domain/services/session-storage.interface';
import { UserContext } from '../../domain/value-objects/user-context.vo';

@Injectable()
export class SessionStorageService implements ISessionStorageService {
  constructor(
    @Inject('ICacheService')
    private readonly cacheService: ICacheService,
  ) {}

  async getUserContext(token: string): Promise<UserContext | null> {
    const key = `token:${token}`;
    const data = await this.cacheService.get<any>(key);
    
    if (!data) {
      return null;
    }

    return UserContext.fromPlainObject(data);
  }

  async setUserContext(token: string, userContext: UserContext, ttl?: number): Promise<void> {
    const key = `token:${token}`;
    await this.cacheService.set(key, userContext.toPlainObject(), ttl);
  }

  async deleteUserContext(token: string): Promise<void> {
    const key = `token:${token}`;
    await this.cacheService.delete(key);
  }
}

