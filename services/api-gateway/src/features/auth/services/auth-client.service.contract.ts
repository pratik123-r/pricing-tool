import { LoginRequestDto, LoginResponseDto } from '../dto';

export interface IAuthClientService {
  login(loginRequest: LoginRequestDto): Promise<LoginResponseDto | null>;
}

