export enum Role {
  OPERATOR = 'operator',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

// export enum UserHttpStatus {
//   OK = 0,
//   CREATED = 1001,
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL_SERVER_ERROR,
//   EXTERNAL_SERVER_ERROR,
//   INVALID_ADDRESS,
//   INVALID_APIKEY,
//   USER_EXISTED,
//   KEY_EXISTED
// }

export enum UserHttpStatus {
  OK = 'OK',
  Created = 'CREATED',
  BadRequest = 'BAD_REQUEST',
  UserNotFound = 'USER_NOT_FOUND',
  DuplicateService = 'DUPLICATE_SERVICE',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  ExternalServerError = 'EXTERNAL_SERVER_ERROR',
  InvalidAddress = 'INVALID_ADDRESS',
  InvalidApikey = 'INVALID_APIKEY',
  UserExisted = 'USER_EXISTED',
  KeyExisted = 'KEY_EXISTED',
}
