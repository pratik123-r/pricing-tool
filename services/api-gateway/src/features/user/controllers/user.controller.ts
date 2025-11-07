import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '../../auth/controllers/auth.guard';
import { User } from '../../auth/controllers/user.decorator';
import { UserContext } from '../../auth/interfaces/user-context.interface';
import { UserService } from '../services/user.service';
import { CreateUserRequestDto, UserResponseDto, PaginationQueryDto } from '../dto';
import { UserPaginationResult } from '../types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user: UserContext): Promise<UserContext> {
    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async findAll(@Query() query: PaginationQueryDto): Promise<UserPaginationResult> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(@Body() createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }
}

