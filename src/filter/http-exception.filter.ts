import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    this.logger.error(exception);

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res: any = exception.getResponse();

    const errorResponse = {
      code: httpStatus,
      error: res.error ?? getError(httpStatus) ?? 'INTERNAL_SERVER_ERROR',
      message: res.message ?? exception.message ?? 'internal server error',
    };

    response.status(httpStatus).json(errorResponse);
  }
}

const getError = (status: number) => {
  return Object.keys(HttpStatus).filter((key) => HttpStatus[key] === status)[0];
};
