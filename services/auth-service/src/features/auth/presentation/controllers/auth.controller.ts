import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginRequestDto } from '../../application/dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly loginUseCase: LoginUseCase) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequestDto): Promise<any> {
    try {
      if (!data || !data.email || !data.password) {
        throw new Error('Email and password are required');
      }
      
      const result = await this.loginUseCase.execute(data);
      
      return {
        success: true,
        message: 'Login successful',
        data: {
          token: result.token,
          userId: result.userId,
        },
      };
    } catch (error) {
      this.logger.error(
        `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}

