export interface IPasswordHashingService {
  compare(password: string, hash: string, salt: string): Promise<boolean>;
}

