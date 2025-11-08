import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordService } from './password.service.contract';

@Injectable()
export class PasswordService implements IPasswordService {
  /**
   * Compares a plain password with a hash using the stored salt
   */
  async compare(password: string, hash: string, salt: string): Promise<boolean> {
    const saltedPassword = password + salt;
    return bcrypt.compare(saltedPassword, hash);
  }
}

