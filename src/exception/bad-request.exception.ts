import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(
    message: any,
    error: any,
    errorCode: any
  ) {
    super(HttpException.createBody(message, error, errorCode), HttpStatus.BAD_REQUEST);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
