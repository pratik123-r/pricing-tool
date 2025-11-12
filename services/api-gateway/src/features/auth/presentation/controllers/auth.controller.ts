import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginRequestDto, LoginResponseDto } from '../../application/dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {}
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {    
    return this.loginUseCase.execute(loginRequest);
  }
}

