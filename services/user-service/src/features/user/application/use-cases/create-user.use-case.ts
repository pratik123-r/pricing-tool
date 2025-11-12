import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, CreateUserData } from '../../domain/repositories/user.repository.interface';
import { IPasswordHashingService } from '../../domain/services/password-hashing.interface';
import { ConflictAppException } from '@shared/infra';
import { CreateUserRequestDto, UserResponseDto } from '../dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHashingService')
    private readonly passwordHashingService: IPasswordHashingService,
  ) {}

  async execute(request: CreateUserRequestDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictAppException(`User with email ${request.email} already exists`);
    }

    const salt = await this.passwordHashingService.generateSalt();
    const hashedPassword = await this.passwordHashingService.hash(request.password, salt);

    const userData: CreateUserData = {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      password: hashedPassword,
      salt,
    };
    const user = await this.userRepository.create(userData);

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

