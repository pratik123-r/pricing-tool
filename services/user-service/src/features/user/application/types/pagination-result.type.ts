import { UserResponseDto } from '../dto';

export interface UserPaginationResult {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}

