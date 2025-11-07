import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseAppException } from '@shared/infra';
import { BaseException } from '../errors/base.exception';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;

    // Handle protocol-agnostic app exceptions (from microservices)
    if (exception instanceof BaseAppException) {
      status = exception.statusCode as HttpStatus;
      message = exception.message;
      code = exception.code;
      details = exception.details;
    }
    // Handle HTTP exceptions (from API Gateway)
    else if (exception instanceof BaseException) {
      status = exception.getStatus();
      message = exception.message;
      code = exception.code;
      details = exception.details;
    }
    // Handle NestJS HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        code = responseObj.code || exception.constructor.name;
        details = responseObj.details;
      }
    }
    // Handle gRPC RpcException (from microservices)
    else if (exception instanceof RpcException) {
      const errorData = exception.getError() as any;
      
      // RpcException can contain either a string or an object
      // If it's an object with code, message, details (from our gRPC filter)
      if (errorData && typeof errorData === 'object' && errorData.code) {
        status = this.mapErrorCodeToHttpStatus(errorData.code);
        message = errorData.message || 'Internal server error';
        code = errorData.code || 'INTERNAL_SERVER_ERROR';
        details = errorData.details;
      }
      // Try to parse if it's a JSON string
      else if (typeof errorData === 'string') {
        try {
          const parsedError = JSON.parse(errorData);
          
          // Handle nested error structure from gRPC filter
          if (parsedError && parsedError.error) {
            status = this.mapErrorCodeToHttpStatus(parsedError.error.code);
            message = parsedError.error.message || 'Internal server error';
            code = parsedError.error.code || 'INTERNAL_SERVER_ERROR';
            details = parsedError.error.details;
          } 
          // Handle flat error structure
          else if (parsedError && parsedError.message) {
            message = parsedError.message;
            code = parsedError.code || 'INTERNAL_SERVER_ERROR';
            details = parsedError.details;
          } else {
            message = errorData;
            code = 'RPC_EXCEPTION';
          }
        } catch (e) {
          // Not JSON, use as-is
          this.logger.error('Failed to parse RpcException error data as JSON', e);
          message = errorData;
          code = 'RPC_EXCEPTION';
        }
      } 
      // Handle object error (fallback)
      else if (errorData && typeof errorData === 'object') {
        message = errorData.message || errorData.toString() || 'Internal server error';
        code = errorData.code || errorData.constructor?.name || 'RPC_EXCEPTION';
        details = errorData.details;
      }
      // Fallback
      else {
        message = 'Internal server error';
        code = 'INTERNAL_SERVER_ERROR';
      }
    }
    // Handle gRPC client errors (from gRPC client calls)
    // These come as Error objects with code, details, and metadata
    // gRPC errors have structure: { code: number, message: string, details: string, metadata: object }
    else if (exception instanceof Error && (exception as any).code !== undefined) {
      const grpcError = exception as any;
      this.logger.error(`gRPC client error: ${grpcError.code} - ${grpcError.message}`);
      
      // The details field should contain the JSON string we sent from Auth Service
      let parsedDetails: any = null;
      
      // Try to parse details if it exists and is a string
      if (grpcError.details && typeof grpcError.details === 'string') {
        // Check if details is our JSON format (starts with {)
        if (grpcError.details.trim().startsWith('{')) {
          try {
            parsedDetails = JSON.parse(grpcError.details);
          } catch (e) {
            this.logger.error('Failed to parse gRPC details as JSON', e);
          }
        }
      }
      
      // If details parsing failed, try to extract from message
      if (!parsedDetails && grpcError.message && grpcError.message.includes('{')) {
        try {
          const jsonMatch = grpcError.message.match(/\{.*\}/s);
          if (jsonMatch) {
            parsedDetails = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          this.logger.error('Failed to parse gRPC message as JSON', e);
        }
      }
      
      // If we successfully parsed details, use them
      if (parsedDetails) {
        if (parsedDetails.error) {
          status = this.mapErrorCodeToHttpStatus(parsedDetails.error.code);
          message = parsedDetails.error.message || 'Internal server error';
          code = parsedDetails.error.code || 'INTERNAL_SERVER_ERROR';
          details = parsedDetails.error.details;
        } else if (parsedDetails.code && parsedDetails.message) {
          status = this.mapErrorCodeToHttpStatus(parsedDetails.code);
          message = parsedDetails.message;
          code = parsedDetails.code;
          details = parsedDetails.details;
        } else if (parsedDetails.message) {
          message = parsedDetails.message;
          code = parsedDetails.code || 'INTERNAL_SERVER_ERROR';
          details = parsedDetails.details;
        }
      } else {
        // Fallback: use details or message
        message = grpcError.details && typeof grpcError.details === 'string' && grpcError.details !== 'Rpc Exception'
          ? grpcError.details
          : grpcError.message || 'Internal server error';
        code = this.mapGrpcCodeToErrorCode(grpcError.code);
      }
    }
    // Handle generic errors
    else if (exception instanceof Error) {
      message = exception.message || 'An error occurred';
      code = exception.constructor.name || 'Error';
      
      // Try to extract code and details from error object
      if ((exception as any).code) {
        code = (exception as any).code;
      }
      if ((exception as any).details) {
        details = (exception as any).details;
      }
    }
    // Catch-all for any unknown exception type
    else {
      this.logger.error(`Unknown exception type: ${typeof exception}`);
      try {
        message = String(exception) || 'Unknown error occurred';
        code = 'UNKNOWN_ERROR';
        details = exception;
      } catch (e) {
        message = 'Failed to process error';
        code = 'ERROR_SERIALIZATION_FAILED';
        this.logger.error('Failed to stringify exception', e);
      }
    }

    // Log stack trace (not in response)
    if (exception instanceof Error && exception.stack) {
      this.logger.error(exception.stack);
    }

    const errorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private mapErrorCodeToHttpStatus(errorCode: string): HttpStatus {
    const statusMap: { [key: string]: HttpStatus } = {
      'BAD_REQUEST': HttpStatus.BAD_REQUEST,
      'UNAUTHORIZED': HttpStatus.UNAUTHORIZED,
      'FORBIDDEN': HttpStatus.FORBIDDEN,
      'NOT_FOUND': HttpStatus.NOT_FOUND,
      'CONFLICT': HttpStatus.CONFLICT,
      'INTERNAL_SERVER_ERROR': HttpStatus.INTERNAL_SERVER_ERROR,
    };

    return statusMap[errorCode] || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private mapGrpcCodeToErrorCode(grpcCode: number): string {
    // Map gRPC status codes to error codes
    const codeMap: { [key: number]: string } = {
      0: 'OK',
      1: 'CANCELLED',
      2: 'UNKNOWN',
      3: 'INVALID_ARGUMENT',
      4: 'DEADLINE_EXCEEDED',
      5: 'NOT_FOUND',
      6: 'ALREADY_EXISTS',
      7: 'PERMISSION_DENIED',
      8: 'RESOURCE_EXHAUSTED',
      9: 'FAILED_PRECONDITION',
      10: 'ABORTED',
      11: 'OUT_OF_RANGE',
      12: 'UNIMPLEMENTED',
      13: 'INTERNAL',
      14: 'UNAVAILABLE',
      15: 'DATA_LOSS',
      16: 'UNAUTHENTICATED',
    };

    return codeMap[grpcCode] || 'INTERNAL_SERVER_ERROR';
  }
}

