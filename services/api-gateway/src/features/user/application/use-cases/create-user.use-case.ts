import { Injectable, Inject } from '@nestjs/common';
import { IUserClientService } from '../../domain/services/user-client.interface';
import { CreateUserRequestDto, UserResponseDto } from '../dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserClientService')
    private readonly userClientService: IUserClientService,
  ) {}

  async execute(request: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userClientService.create(request);
  }
}

