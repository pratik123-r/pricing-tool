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
              }
            }
            
            throw error;
          })
        )
      );
      
      if (response && response.data && response.data.token && response.data.userId) {
        return response.data;
      }
      
      if (response && response.token && response.userId) {
        return response as LoginResponseDto;
      }
      
      return response as LoginResponseDto;
    } catch (error: any) {
      this.logger.error(`Login failed: ${error?.message || 'Unknown error'}`);
      throw error;
    }
  }
}

