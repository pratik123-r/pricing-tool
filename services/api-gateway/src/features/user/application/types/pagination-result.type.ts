import { UserResponseDto } from '@shared/infra';

export interface UserPaginationResult {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}

