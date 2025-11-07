import { UserResponseDto } from '../dto/user-response.dto';
import { PaginationResultWithMeta } from '../../../common/types';

export interface UserPaginationResult extends PaginationResultWithMeta<UserResponseDto> {}

