import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../repositories/user.repository.contract';
import { IPasswordService } from './password.service.contract';
import { ITokenService } from './token.service.contract';
import { IAuthRedisService } from './auth-redis.service';
import { IAuthService } from './auth.service.contract';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserContext } from '../interfaces/user-context.interface';
import { UnauthorizedAppException } from '@shared/infra';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordService')
    private readonly passwordService: IPasswordService,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('IAuthRedisService')
    private readonly authRedisService: IAuthRedisService,
  ) {}

  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedAppException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(
      password,
      user.password,
      user.salt,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedAppException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.validateCredentials(email, password);

    const token = this.tokenService.generate(user.id);
    const userContext: UserContext = {
      userId: user.id,
      email: user.email,
      roles: [],
      token,
    };

    await this.authRedisService.setUserContext(token, userContext);

    return {
      token,
      userId: user.id,
    };
  }
}

