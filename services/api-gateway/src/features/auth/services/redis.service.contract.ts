import { UserContext } from '../interfaces/user-context.interface';

export interface IRedisService {
  getUserContext(token: string): Promise<UserContext | null>;
}

