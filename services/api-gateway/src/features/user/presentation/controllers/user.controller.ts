import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { AuthGuard, User } from '../../../../common/guards';
import { UserContext } from '../../../auth/domain/value-objects/user-context.vo';
import { IUserClientService } from '../../domain/services/user-client.interface';
import { CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../../application/dto';
import { UserPaginationResult } from '../../application/types';

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserClientService')
    private readonly userClientService: IUserClientService,
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
    return this.userClientService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userClientService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(@Body() createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userClientService.create(createUserDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    return this.userClientService.update(id, updateUserDto);
  }
}

