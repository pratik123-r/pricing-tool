import { CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../../application/dto';
import { UserPaginationResult } from '../../application/types';

export interface IUserClientService {
  findAll(query: PaginationQueryDto): Promise<UserPaginationResult>;
  findById(id: string): Promise<UserResponseDto>;
  create(request: CreateUserRequestDto): Promise<UserResponseDto>;
  update(id: string, request: UpdateUserRequestDto): Promise<UserResponseDto>;
}

