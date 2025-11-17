import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserContext } from '../../domain/value-objects/user-context.vo';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordHashingService } from '../../domain/services/password-hashing.interface';
import { ITokenGenerationService } from '../../domain/services/token-generation.interface';
import { ISessionStorageService } from '../../domain/services/session-storage.interface';
import { UnauthorizedAppException } from '@shared/infra';
import { LoginRequestDto, LoginResponseDto } from '../dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHashingService')
    private readonly passwordHashingService: IPasswordHashingService,
    @Inject('ITokenGenerationService')
    private readonly tokenGenerationService: ITokenGenerationService,
    @Inject('ISessionStorageService')
    private readonly sessionStorageService: ISessionStorageService,
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedAppException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHashingService.compare(
      request.password,
      user.password,
      user.salt,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedAppException('Invalid credentials');
    }

    const token = this.tokenGenerationService.generate(user.id);
    const refreshToken = this.tokenGenerationService.generateRefreshToken(user.id);

    const userContext = new UserContext(
      user.id,
      user.email,
      [], // roles can be added later
      token,
    );

    await this.sessionStorageService.setUserContext(token, userContext);
    await this.sessionStorageService.setRefreshToken(refreshToken, user.id);

    return {
      token,
      refreshToken,
      userId: user.id,
    };
  }
}

