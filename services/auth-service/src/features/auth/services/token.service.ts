import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ITokenService } from './token.service.contract';

@Injectable()
export class TokenService implements ITokenService {
  generate(userId: string): string {
    const timestamp = Date.now().toString();
    const data = `${userId}:${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

