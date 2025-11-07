import { Injectable, Inject } from '@nestjs/common';
import { IAuthClientService } from './auth-client.service.contract';
import { IAuthService } from './auth.service.contract';
import { LoginRequestDto, LoginResponseDto } from '../dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IAuthClientService')
    private readonly authClientService: IAuthClientService,
  ) {}

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    // Let exceptions propagate - they will be handled by the HTTP exception filter
    console.log('Login request received:====', loginRequest);
    return this.authClientService.login(loginRequest);
  }
}

