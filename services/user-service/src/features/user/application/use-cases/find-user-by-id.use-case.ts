import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { NotFoundAppException } from '@shared/infra';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dto';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundAppException(`User with id ${id} not found`);
    }

    return this.toDto(user);
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

