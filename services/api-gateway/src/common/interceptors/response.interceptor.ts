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
    const method = request.method;
    const url = request.url;
    
    return next.handle().pipe(
      map((data) => {
        // If data is already formatted (has success property), return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Special handling for login endpoint
        if (url.includes('/auth/login')) {
          if (data && typeof data === 'object' && 'token' in data) {
            return ResponseUtil.success(data, 'Login successful');
          }
          return ResponseUtil.success(data || {}, 'Login successful');
        }

        // If data has pagination structure (data, total, page, limit)
        if (data && typeof data === 'object' && 'data' in data && 'total' in data && 'page' in data && 'limit' in data) {
          return ResponseUtil.paginated(
            data.data,
            data.page,
            data.limit,
            data.total,
            this.getSuccessMessage(method, 'list'),
          );
        }

        // For single item responses
        const message = this.getSuccessMessage(method, 'item');
        return ResponseUtil.success(data, message);
      }),
    );
  }

  private getSuccessMessage(method: string, type: string): string {
    const messages: { [key: string]: { [key: string]: string } } = {
      GET: {
        list: 'Items retrieved successfully',
        item: 'Item retrieved successfully',
      },
      POST: {
        item: 'Item created successfully',
      },
      PUT: {
        item: 'Item updated successfully',
      },
      DELETE: {
        item: 'Item deleted successfully',
      },
    };

    return messages[method]?.[type] || 'Request successful';
  }
}

