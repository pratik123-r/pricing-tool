import { Injectable, Inject } from '@nestjs/common';
import { ISessionStorageService } from '../../domain/services/session-storage.interface';
import { UserContext } from '../../domain/value-objects/user-context.vo';

@Injectable()
export class GetUserContextUseCase {
  constructor(
    @Inject('ISessionStorageService')
    private readonly sessionStorageService: ISessionStorageService,
  ) {}

  async execute(token: string): Promise<UserContext | null> {
    return this.sessionStorageService.getUserContext(token);
  }
}

