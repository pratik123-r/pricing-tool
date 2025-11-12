import { UserContext } from '../value-objects/user-context.vo';

export interface ISessionStorageService {
  getUserContext(token: string): Promise<UserContext | null>;
  setUserContext(token: string, userContext: UserContext, ttl?: number): Promise<void>;
  deleteUserContext(token: string): Promise<void>;
}

