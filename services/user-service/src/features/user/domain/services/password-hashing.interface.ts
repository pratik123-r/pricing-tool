export interface IPasswordHashingService {
  generateSalt(): Promise<string>;
  hash(password: string, salt: string): Promise<string>;
}

