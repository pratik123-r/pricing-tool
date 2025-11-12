import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseUtil } from '../utils';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        if (url.includes('/auth/login')) {
          if (data && typeof data === 'object' && 'token' in data) {
            return ResponseUtil.success(data);
          }
          return ResponseUtil.success(data || {});
        }

        if (data && typeof data === 'object' && 'data' in data && 'total' in data && 'page' in data && 'limit' in data) {
          return ResponseUtil.paginated(
            data.data,
            data.page,
            data.limit,
            data.total,
          );
        }

        return ResponseUtil.success(data);
      }),
    );
  }

}

