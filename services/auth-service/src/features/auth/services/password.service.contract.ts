export interface IPasswordService {
  compare(password: string, hash: string, salt: string): Promise<boolean>;
}

