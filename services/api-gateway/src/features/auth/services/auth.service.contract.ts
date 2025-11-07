import { LoginRequestDto, LoginResponseDto } from '../dto';

export interface IAuthService {
  login(loginRequest: LoginRequestDto): Promise<LoginResponseDto>;
}

