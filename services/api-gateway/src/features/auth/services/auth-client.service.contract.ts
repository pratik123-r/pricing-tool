import { LoginRequestDto, LoginResponseDto } from '../../../../../auth-service/src/features/auth/dto';

export interface IAuthClientService {
  login(loginRequest: LoginRequestDto): Promise<LoginResponseDto>;
}

