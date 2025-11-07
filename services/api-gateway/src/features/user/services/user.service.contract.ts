import { CreateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../dto';
import { UserPaginationResult } from '../types';

export interface IUserService {
  findAll(query: PaginationQueryDto): Promise<UserPaginationResult>;
  findById(id: string): Promise<UserResponseDto>;
  create(createUserDto: CreateUserRequestDto): Promise<UserResponseDto>;
}

