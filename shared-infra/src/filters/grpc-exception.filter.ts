import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { BaseAppException } from '../errors';

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;

    // Handle BaseAppException (custom application exceptions)
    if (exception instanceof BaseAppException) {
      message = exception.message;
      code = exception.code;
      details = exception.details;
      this.logger.error(`BaseAppException: ${code} - ${message}`, exception.stack);
    } 
    // Handle generic Error objects
    else if (exception instanceof Error) {
      message = exception.message || 'An error occurred';
      code = exception.constructor.name || 'Error';
      
      // Try to extract more details from the error
      if ((exception as any).code) {
        code = (exception as any).code;
      }
      if ((exception as any).details) {
        details = (exception as any).details;
      }
      
      this.logger.error(`Error: ${code} - ${message}`, exception.stack);
    } 
    // Handle unknown exception types
    else {
      try {
        message = String(exception) || 'Unknown error occurred';
        details = exception;
        this.logger.error(`Unknown exception type: ${typeof exception}`, JSON.stringify(exception));
      } catch (e) {
        message = 'Failed to serialize error';
        this.logger.error('Failed to stringify exception', e);
      }
    }

    // Create JSON string with error details
    const errorJson = JSON.stringify({
      code,
      message,
      details,
    });
    
    // Pass the JSON string directly to RpcException
    return throwError(() => new RpcException(errorJson));
  }
}

