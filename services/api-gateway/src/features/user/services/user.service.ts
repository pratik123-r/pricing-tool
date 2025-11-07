import { Injectable, Inject } from '@nestjs/common';
import { IUserClientService } from './user-client.service.contract';
import { IUserService } from './user.service.contract';
import { CreateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../dto';
import { UserPaginationResult } from '../types';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserClientService')
    private readonly userClientService: IUserClientService,
  ) {}

  async findAll(query: PaginationQueryDto): Promise<UserPaginationResult> {
    return this.userClientService.findAll(query);
  }

  async findById(id: string): Promise<UserResponseDto> {
    return this.userClientService.findById(id);
  }

  async create(createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userClientService.create(createUserDto);
  }
}

