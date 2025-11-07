import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserData, UserPaginationResult } from '../types';

export interface IUserService {
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<UserResponseDto>;
  create(userData: CreateUserData): Promise<UserResponseDto>;
  findAll(page?: number, limit?: number): Promise<UserPaginationResult>;
}

