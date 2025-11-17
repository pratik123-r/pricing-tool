import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { IAuthClientService } from '../../domain/services/auth-client.interface';
import { LoginRequestDto, LoginResponseDto, RefreshTokenRequestDto, RefreshTokenResponseDto } from '../../application/dto';

interface AuthService {
  Login(data: LoginRequestDto): Observable<{ success: boolean; message: string; data: LoginResponseDto }>;
  RefreshToken(data: RefreshTokenRequestDto): Observable<{ success: boolean; message: string; data: RefreshTokenResponseDto }>;
}

@Injectable()
export class AuthClientService implements IAuthClientService, OnModuleInit {
  private authService: AuthService;

  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await firstValueFrom(
      this.authService.Login(loginRequest)
    );
    return response.data;
  }

  async refreshToken(refreshTokenRequest: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    const response = await firstValueFrom(
      this.authService.RefreshToken(refreshTokenRequest)
    );
    return response.data;
  }
}

