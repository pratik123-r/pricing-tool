import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, UpdateUserData } from '../../domain/repositories/user.repository.interface';
import { IPasswordHashingService } from '../../domain/services/password-hashing.interface';
import { NotFoundAppException, ConflictAppException } from '@shared/infra';
import { UpdateUserRequestDto, UserResponseDto } from '../dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHashingService')
    private readonly passwordHashingService: IPasswordHashingService,
  ) {}

  async execute(id: string, request: UpdateUserRequestDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundAppException(`User with id ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (request.email && request.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(request.email);
      if (existingUser) {
        throw new ConflictAppException(`User with email ${request.email} already exists`);
      }
    }

    const updateData: UpdateUserData = {};

    if (request.firstName !== undefined) {
      updateData.firstName = request.firstName;
    }

    if (request.lastName !== undefined) {
      updateData.lastName = request.lastName;
    }

    if (request.email !== undefined) {
      updateData.email = request.email;
    }

    // Hash password if it's being updated
    if (request.password !== undefined) {
      const salt = await this.passwordHashingService.generateSalt();
      const hashedPassword = await this.passwordHashingService.hash(request.password, salt);
      updateData.password = hashedPassword;
      updateData.salt = salt;
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    return this.toDto(updatedUser);
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

