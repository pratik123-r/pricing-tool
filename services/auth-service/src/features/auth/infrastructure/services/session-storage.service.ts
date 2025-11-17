import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICacheService } from '@shared/infra';
import { ISessionStorageService } from '../../domain/services/session-storage.interface';
import { UserContext } from '../../domain/value-objects/user-context.vo';

@Injectable()
export class SessionStorageService implements ISessionStorageService {
  private readonly defaultTtl: number;
  private readonly refreshTokenTtl: number;

  constructor(
    @Inject('ICacheService')
    private readonly cacheService: ICacheService,
    private readonly configService: ConfigService,
  ) {
    this.defaultTtl = this.configService.get<number>('ACCESS_TOKEN_TTL_SECONDS', 3600);
    this.refreshTokenTtl = this.configService.get<number>('REFRESH_TOKEN_TTL_SECONDS', 7 * 24 * 3600);
  }

  async setUserContext(
    token: string,
    userContext: UserContext,
    ttl: number = this.defaultTtl,
  ): Promise<void> {
    const key = `token:${token}`;
    await this.cacheService.set(key, userContext.toPlainObject(), ttl);
  }

  async getUserContext(token: string): Promise<UserContext | null> {
    const key = `token:${token}`;
    const data = await this.cacheService.get<any>(key);
    
    if (!data) {
      return null;
    }

    return new UserContext(
      data.userId,
      data.email,
      data.roles || [],
      data.token,
    );
  }

  async deleteUserContext(token: string): Promise<void> {
    const key = `token:${token}`;
    await this.cacheService.delete(key);
  }

  async setRefreshToken(refreshToken: string, userId: string, ttl: number = this.refreshTokenTtl): Promise<void> {
    const key = `refresh_token:${refreshToken}`;
    await this.cacheService.set(key, { userId }, ttl);
  }

  async getUserIdByRefreshToken(refreshToken: string): Promise<string | null> {
    const key = `refresh_token:${refreshToken}`;
    const data = await this.cacheService.get<{ userId: string }>(key);
    return data?.userId || null;
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    const key = `refresh_token:${refreshToken}`;
    await this.cacheService.delete(key);
  }
}

