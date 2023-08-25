import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(
    message: any = 'access denied',
  ) {
    super(HttpException.createBody(message, 'FORBIDDEN', 403), HttpStatus.FORBIDDEN);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
