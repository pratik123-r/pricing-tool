import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LoginRequestDto, RefreshTokenRequestDto, LoginResponseDto, RefreshTokenResponseDto } from '../../application/dto';

@Controller()
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(data);
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(data: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenUseCase.execute(data);
  }
}

