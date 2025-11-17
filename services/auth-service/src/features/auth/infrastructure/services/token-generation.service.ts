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

  generateRefreshToken(userId: string): string {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const data = `${userId}:${timestamp}:${randomBytes}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

