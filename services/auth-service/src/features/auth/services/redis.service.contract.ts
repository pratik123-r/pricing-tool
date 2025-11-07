import { UserContext } from '../interfaces/user-context.interface';

export interface IRedisService {
  setUserContext(token: string, userContext: UserContext, ttl?: number): Promise<void>;
  getUserContext(token: string): Promise<UserContext | null>;
  deleteUserContext(token: string): Promise<void>;
}

