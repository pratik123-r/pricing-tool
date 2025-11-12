import { Injectable, Inject } from '@nestjs/common';
import { IUserClientService } from '../../domain/services/user-client.interface';
import { PaginationQueryDto } from '../dto';
import { UserPaginationResult } from '../types';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject('IUserClientService')
    private readonly userClientService: IUserClientService,
  ) {}

  async execute(query: PaginationQueryDto): Promise<UserPaginationResult> {
    return this.userClientService.findAll(query);
  }
}

