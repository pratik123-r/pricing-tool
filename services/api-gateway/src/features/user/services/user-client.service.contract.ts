import { CreateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../../../../../user-service/src/features/user/dto';
import { UserPaginationResult } from '../types';

export interface IUserClientService {
  findAll(query: PaginationQueryDto): Promise<UserPaginationResult>;
  findById(id: string): Promise<UserResponseDto>;
  create(createUserDto: CreateUserRequestDto): Promise<UserResponseDto>;
}

