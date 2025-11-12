import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ITokenGenerationService } from '../../domain/services/token-generation.interface';

@Injectable()
export class TokenGenerationService implements ITokenGenerationService {
  generate(userId: string): string {
    const timestamp = Date.now().toString();
    const data = `${userId}:${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

