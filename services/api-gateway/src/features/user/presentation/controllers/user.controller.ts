import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { AuthGuard, User } from '../../../../common/guards';
import { UserContext } from '../../../auth/domain/value-objects/user-context.vo';
import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../../application/dto';
import { UserPaginationResult } from '../../application/types';

@Controller('users')
export class UserController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user: UserContext): Promise<UserContext> {
    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async findAll(@Query() query: PaginationQueryDto): Promise<UserPaginationResult> {
    return this.findAllUsersUseCase.execute(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.findUserByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(@Body() createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }
}

