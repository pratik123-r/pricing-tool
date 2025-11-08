import { UserResponseDto } from '../../../../../user-service/src/features/user/dto';
import { PaginationResultWithMeta } from '../../../common/types';

export interface UserPaginationResult extends PaginationResultWithMeta<UserResponseDto> {}

