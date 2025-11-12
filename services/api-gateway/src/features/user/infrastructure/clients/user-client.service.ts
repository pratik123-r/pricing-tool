import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { IUserClientService } from '../../domain/services/user-client.interface';
import { CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../../application/dto';
import { UserPaginationResult } from '../../application/types';
import { USER_SERVICE } from '../../constants';

interface UserService {
  FindAll(data: { page?: number; limit?: number }): Observable<UserPaginationResult>;
  FindById(data: { id: string }): Observable<UserResponseDto>;
  Create(data: CreateUserRequestDto): Observable<UserResponseDto>;
  Update(data: { id: string } & UpdateUserRequestDto): Observable<UserResponseDto>;
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
    return firstValueFrom(
      this.userService.FindAll({
        page: query.page,
        limit: query.limit,
      })
    );
  }

  async findById(id: string): Promise<UserResponseDto> {
    return firstValueFrom(this.userService.FindById({ id }));
  }

  async create(createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    return firstValueFrom(this.userService.Create(createUserDto));
  }

  async update(id: string, updateUserDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    return firstValueFrom(this.userService.Update({ id, ...updateUserDto }));
  }
}

