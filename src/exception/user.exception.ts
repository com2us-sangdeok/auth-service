import { ServerException } from './server.exception';

export class UserException extends ServerException {
  constructor(message: any, error: any, statusCode: UserHttpStatus) {
    super(ServerException.createBody(message, error, statusCode), statusCode);
  }
}

export enum UserHttpStatus {
  OK = 1000,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  EXTERNAL_SERVER_ERROR,
}
