import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseAppException } from '@shared/infra';

export class BaseException extends HttpException {
  public readonly code: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    code?: string,
    details?: any,
  ) {
    super(message, statusCode);
    this.code = code || this.constructor.name;
    this.details = details;
  }

  getResponse(): any {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
      timestamp: new Date().toISOString(),
    };
  }

  toAppException(): BaseAppException {
    return new BaseAppException(
      this.message,
      this.getStatus(),
      this.code,
      this.details,
    );
  }
}

