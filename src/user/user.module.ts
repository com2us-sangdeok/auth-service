import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { UserEntity } from '../entities';
import { UserV1Service } from './v1/user.v1.service';
import { UserV1Repository } from './v1/repository/user.v1.repository';
import { UserV1Controller } from './v1/user.v1.controller';
import { KeyEntity } from '../entities/key.entity';
import { ServiceEntity } from '../entities/service.entity';
import { UserServiceOperationEntity } from '../entities/user-service-operation.entity';
import { ServiceV1Controller } from './v1/service/service.v1.controller';
import { ServiceV1Service } from './v1/service/service.v1.service';
import { CredentialsV1Service } from './v1/credentials/credentials.v1.service';
import { CredentialsV1Controller } from './v1/credentials/credentials.v1.controller';
import { CredentialsV1Repository } from './v1/repository/credentials.v1.repository';
import { CredentialsEntity } from '../entities/credentials.entity';
import { ServiceV1Repository } from './v1/repository/service.v1.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ServiceEntity,
      UserServiceOperationEntity,
      KeyEntity,
      CredentialsEntity,
    ]),
    WinstonModule,
  ],
  controllers: [UserV1Controller, ServiceV1Controller, CredentialsV1Controller],
  providers: [
    UserV1Service,
    ServiceV1Service,
    CredentialsV1Service,
    UserV1Repository,
    ServiceV1Repository,
    CredentialsV1Repository,
  ],
  exports: [UserV1Service, ServiceV1Service, CredentialsV1Service],
})
export class UserModule {}
