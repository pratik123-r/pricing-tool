import { Controller, Post, Body, HttpCode, HttpStatus, Logger, Inject } from '@nestjs/common';
import { IAuthClientService } from '../../domain/services/auth-client.interface';
import { LoginRequestDto, LoginResponseDto } from '../../application/dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    @Inject('IAuthClientService')
    private readonly authClientService: IAuthClientService,
  ) {}
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {    
    return this.authClientService.login(loginRequest);
  }
}

