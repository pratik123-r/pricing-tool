import { Injectable, Inject } from '@nestjs/common';
import { IAuthClientService } from '../../domain/services/auth-client.interface';
import { LoginRequestDto, LoginResponseDto } from '../dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IAuthClientService')
    private readonly authClientService: IAuthClientService,
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authClientService.login(request);
  }
}

