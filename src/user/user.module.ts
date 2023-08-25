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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ServiceEntity,
      UserServiceOperationEntity,
      KeyEntity,
    ]),
    WinstonModule,
  ],
  controllers: [UserV1Controller],
  providers: [UserV1Service, UserV1Repository],
  exports: [UserV1Service],
})
export class UserModule {}
