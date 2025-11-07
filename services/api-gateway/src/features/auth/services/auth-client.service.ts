import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, catchError } from 'rxjs';
import { IAuthClientService } from './auth-client.service.contract';
import { LoginRequestDto, LoginResponseDto } from '../dto';

interface AuthService {
  Login(data: LoginRequestDto): Observable<LoginResponseDto>;
}

@Injectable()
export class AuthClientService implements IAuthClientService, OnModuleInit {
  private readonly logger = new Logger(AuthClientService.name);
  private authService: AuthService;

  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      const response: any = await firstValueFrom(
        this.authService.Login(loginRequest).pipe(
          catchError((error: any) => {
            this.logger.error(`gRPC call error: ${error?.code} - ${error?.message}`);
            
            // Try to parse error details if available
            if (error?.details) {
              try {
                const parsedDetails = typeof error.details === 'string' 
                  ? JSON.parse(error.details) 
                  : error.details;
                
                if (parsedDetails && parsedDetails.error) {
                  const actualError = new Error(parsedDetails.error.message);
                  (actualError as any).code = parsedDetails.error.code;
                  (actualError as any).details = parsedDetails.error.details;
                  throw actualError;
                }
              } catch (parseError) {
                // Parsing failed, continue with original error
              }
            }
            
            throw error;
          })
        )
      );
      
      // gRPC returns proto format: { success, message, data: { token, userId } }
      if (response && response.data && response.data.token && response.data.userId) {
        return response.data;
      }
      
      // If response already has token and userId at root (fallback), return as is
      if (response && response.token && response.userId) {
        return response as LoginResponseDto;
      }
      
      // Fallback: return response as is
      return response as LoginResponseDto;
    } catch (error: any) {
      this.logger.error(`Login failed: ${error?.message || 'Unknown error'}`);
      throw error;
    }
  }
}

