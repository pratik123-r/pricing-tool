import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.contract';
import { IPasswordService } from './password.service.contract';
import { IUserService } from './user.service.contract';
import { User } from '../entities/user.entity';
import { NotFoundAppException, ConflictAppException } from '@shared/infra';
import { UserMapper } from './user.mapper';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserData, UserPaginationResult } from '../types';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordService')
    private readonly passwordService: IPasswordService,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundAppException(`User with email ${email} not found`);
    }
    return user;
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundAppException(`User with id ${id} not found`);
    }
    return UserMapper.toDto(user);
  }

  async create(userData: CreateUserData): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictAppException(`User with email ${userData.email} already exists`);
    }

    const salt = await this.passwordService.generateSalt();
    const hashedPassword = await this.passwordService.hash(userData.password, salt);
    
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      salt,
    });
    return UserMapper.toDto(user);
  }

  async findAll(page?: number, limit?: number): Promise<UserPaginationResult> {
    const pageNum = page || 1;
    const limitNum = limit || 10;
    
    const { data, total } = await this.userRepository.findAll(pageNum, limitNum);
    return {
      data: UserMapper.toDtoList(data),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }
}

