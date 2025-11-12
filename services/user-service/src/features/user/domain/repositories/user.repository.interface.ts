import { User } from '../entities/user.entity';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  salt?: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: CreateUserData): Promise<User>;
  update(id: string, userData: UpdateUserData): Promise<User>;
  findAll(page: number, limit: number): Promise<{ data: User[]; total: number }>;
}

