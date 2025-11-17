import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserContext } from '../../domain/value-objects/user-context.vo';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ITokenGenerationService } from '../../domain/services/token-generation.interface';
import { ISessionStorageService } from '../../domain/services/session-storage.interface';
import { UnauthorizedAppException } from '@shared/infra';
import { RefreshTokenRequestDto, RefreshTokenResponseDto } from '../dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenGenerationService')
    private readonly tokenGenerationService: ITokenGenerationService,
    @Inject('ISessionStorageService')
    private readonly sessionStorageService: ISessionStorageService,
  ) {}

  async execute(request: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    // Validate refresh token and get userId
    const userId = await this.sessionStorageService.getUserIdByRefreshToken(request.refreshToken);
    
    if (!userId) {
      throw new UnauthorizedAppException('Invalid or expired refresh token');
    }

    // Verify user still exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      // Clean up invalid refresh token
      await this.sessionStorageService.deleteRefreshToken(request.refreshToken);
      throw new UnauthorizedAppException('User not found');
    }

    // Generate new tokens
    const newToken = this.tokenGenerationService.generate(user.id);
    const newRefreshToken = this.tokenGenerationService.generateRefreshToken(user.id);

    // Create new user context
    const userContext = new UserContext(
      user.id,
      user.email,
      [], // roles can be added later
      newToken,
    );

    // Store new tokens
    await this.sessionStorageService.setUserContext(newToken, userContext);
    await this.sessionStorageService.setRefreshToken(newRefreshToken, user.id);

    // Delete old refresh token (token rotation for security)
    await this.sessionStorageService.deleteRefreshToken(request.refreshToken);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      userId: user.id,
    };
  }
}

