import { LoginRequestDto, LoginResponseDto, RefreshTokenRequestDto, RefreshTokenResponseDto } from '../../application/dto';

export interface IAuthClientService {
  login(request: LoginRequestDto): Promise<LoginResponseDto>;
  refreshToken(request: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto>;
}

