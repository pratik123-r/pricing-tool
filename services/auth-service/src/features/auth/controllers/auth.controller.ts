import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto, LoginResponseDto } from '../dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequestDto): Promise<any> {
    try {
      if (!data || !data.email || !data.password) {
        throw new Error('Email and password are required');
      }
      
      const result = await this.authService.login(data.email, data.password);
      
      // Return in proto format matching auth.proto: LoginResponse
      return {
        success: true,
        message: 'Login successful',
        data: {
          token: result.token,
          userId: result.userId,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }
}

