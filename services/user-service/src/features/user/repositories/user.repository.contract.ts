import { User } from '../entities/user.entity';
import { IBaseRepository } from '@shared/infra';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}

