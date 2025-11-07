import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { IPasswordService } from './password.service.contract';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly saltRounds = 10;
  private readonly saltLength = 32; // 32 bytes = 256 bits

  /**
   * Generates a random salt for password hashing
   */
  async generateSalt(): Promise<string> {
    return crypto.randomBytes(this.saltLength).toString('hex');
  }

  /**
   * Hashes a password with the provided salt
   * Uses bcrypt with the salt for additional security
   */
  async hash(password: string, salt: string): Promise<string> {
    // Combine password with salt before hashing
    const saltedPassword = password + salt;
    return bcrypt.hash(saltedPassword, this.saltRounds);
  }

  /**
   * Compares a plain password with a hash using the stored salt
   */
  async compare(password: string, hash: string, salt: string): Promise<boolean> {
    // Combine password with salt before comparing
    const saltedPassword = password + salt;
    return bcrypt.compare(saltedPassword, hash);
  }
}

