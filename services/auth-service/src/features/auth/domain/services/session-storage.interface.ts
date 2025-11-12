import { UserContext } from '../value-objects/user-context.vo';

export interface ISessionStorageService {
  setUserContext(token: string, userContext: UserContext, ttl?: number): Promise<void>;
  getUserContext(token: string): Promise<UserContext | null>;
  deleteUserContext(token: string): Promise<void>;
}

