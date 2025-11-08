import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { IAuthClientService } from './auth-client.service.contract';
import { LoginRequestDto, LoginResponseDto } from '../../../../../auth-service/src/features/auth/dto';

interface AuthService {
  Login(data: LoginRequestDto): Observable<LoginResponseDto>;
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
    return firstValueFrom(
      this.authService.Login(loginRequest)
    );
  }
}

