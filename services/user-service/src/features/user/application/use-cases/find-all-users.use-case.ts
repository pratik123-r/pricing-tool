import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto, PaginationQueryDto } from '../dto';
import { UserPaginationResult } from '../types';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: PaginationQueryDto): Promise<UserPaginationResult> {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const { data, total } = await this.userRepository.findAll(page, limit);

    return {
      data: data.map(user => this.toDto(user)),
      total,
      page,
      limit,
    };
  }

  private toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }
}

