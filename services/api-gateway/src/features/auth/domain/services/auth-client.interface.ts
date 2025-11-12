import { LoginRequestDto, LoginResponseDto } from '../../application/dto';

export interface IAuthClientService {
  login(request: LoginRequestDto): Promise<LoginResponseDto>;
}

