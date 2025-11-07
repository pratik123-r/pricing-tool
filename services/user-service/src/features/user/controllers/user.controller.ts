import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { CreateUserRequestDto, UserResponseDto } from '../dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'FindAll')
  async findAll(data: { page?: number; limit?: number }) {
    return this.userService.findAll(data.page, data.limit);
  }

  @GrpcMethod('UserService', 'FindById')
  async findById(data: { id: string }): Promise<UserResponseDto> {
    return this.userService.findById(data.id);
  }

  @GrpcMethod('UserService', 'Create')
  async create(data: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(data);
  }
}

