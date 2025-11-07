export interface IPasswordService {
  generateSalt(): Promise<string>;
  hash(password: string, salt: string): Promise<string>;
  compare(password: string, hash: string, salt: string): Promise<boolean>;
}

