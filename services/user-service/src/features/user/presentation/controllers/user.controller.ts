import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case';
import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users.use-case';
import { CreateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../../application/dto';
import { UserPaginationResult } from '../../application/types';

@Controller()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
  ) {}

  @GrpcMethod('UserService', 'FindAll')
  async findAll(data: PaginationQueryDto): Promise<UserPaginationResult> {
    return this.findAllUsersUseCase.execute(data);
  }

  @GrpcMethod('UserService', 'FindById')
  async findById(data: { id: string }): Promise<UserResponseDto> {
    return this.findUserByIdUseCase.execute(data.id);
  }

  @GrpcMethod('UserService', 'Create')
  async create(data: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(data);
  }
}

