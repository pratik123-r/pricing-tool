export class BaseAppException extends Error {
  public readonly code: string;
  public readonly details?: any;
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any,
  ) {
    super(message);
    this.code = code || this.constructor.name;
    this.details = details;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BaseAppException.prototype);
  }
}

