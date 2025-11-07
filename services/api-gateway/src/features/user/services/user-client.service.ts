import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { IUserClientService } from './user-client.service.contract';
import { CreateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../dto';
import { UserPaginationResult } from '../types';
import { USER_SERVICE } from '../constants';

interface UserService {
  FindAll(data: { page?: number; limit?: number }): Observable<UserPaginationResult>;
  FindById(data: { id: string }): Observable<UserResponseDto>;
  Create(data: CreateUserRequestDto): Observable<UserResponseDto>;
}

@Injectable()
export class UserClientService implements IUserClientService, OnModuleInit {
  private userService: UserService;

  constructor(
    @Inject(USER_SERVICE) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  async findAll(query: PaginationQueryDto): Promise<UserPaginationResult> {
    // Exceptions will be handled by the HTTP exception filter
    return firstValueFrom(
      this.userService.FindAll({
        page: query.page,
        limit: query.limit,
      }),
    );
  }

  async findById(id: string): Promise<UserResponseDto> {
    // Exceptions will be handled by the HTTP exception filter
    return firstValueFrom(this.userService.FindById({ id }));
  }

  async create(createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    // Exceptions will be handled by the HTTP exception filter
    return firstValueFrom(this.userService.Create(createUserDto));
  }
}

