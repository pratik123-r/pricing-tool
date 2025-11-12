import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHashingService } from '../../domain/services/password-hashing.interface';

@Injectable()
export class PasswordHashingService implements IPasswordHashingService {
  async compare(password: string, hash: string, salt: string): Promise<boolean> {
    const saltedPassword = password + salt;
    return bcrypt.compare(saltedPassword, hash);
  }
}

