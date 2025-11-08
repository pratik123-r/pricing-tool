import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { AuthGuard } from '../../auth/controllers/auth.guard';
import { User } from '../../auth/controllers/user.decorator';
import { UserContext } from '../../auth/interfaces/user-context.interface';
import { IUserClientService } from '../services/user-client.service.contract';
import { CreateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../../../../../user-service/src/features/user/dto';
import { UserPaginationResult } from '../types';

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
}

