import { Injectable, Inject } from '@nestjs/common';
import { IUserClientService } from '../../domain/services/user-client.interface';
import { UserResponseDto } from '../dto';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject('IUserClientService')
    private readonly userClientService: IUserClientService,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    return this.userClientService.findById(id);
  }
}

