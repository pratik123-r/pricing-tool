import { LoginResponseDto } from '../dto/login-response.dto';
import { User } from '../entities/user.entity';

export interface IAuthService {
  validateCredentials(email: string, password: string): Promise<User>;
  login(email: string, password: string): Promise<LoginResponseDto>;
}

