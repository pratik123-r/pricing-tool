export interface ICacheService {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: string | number | object, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  expire(key: string, seconds: number): Promise<void>;
}

