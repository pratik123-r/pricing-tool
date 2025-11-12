import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { IPasswordHashingService } from '../../domain/services/password-hashing.interface';

@Injectable()
export class PasswordHashingService implements IPasswordHashingService {
  private readonly saltRounds = 10;
  private readonly saltLength = 32; // 32 bytes = 256 bits

  async generateSalt(): Promise<string> {
    return crypto.randomBytes(this.saltLength).toString('hex');
  }

  async hash(password: string, salt: string): Promise<string> {
    const saltedPassword = password + salt;
    return bcrypt.hash(saltedPassword, this.saltRounds);
  }
}

