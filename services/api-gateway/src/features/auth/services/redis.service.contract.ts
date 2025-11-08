import { UserContext } from '../../../common/types';

export interface IRedisService {
  getUserContext(token: string): Promise<UserContext | null>;
}

