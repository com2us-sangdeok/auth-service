import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { CompanyV1Controller } from './v1/company.v1.controller';
import { CompanyV1Service } from './v1/company.v1.service';
import { CompanyV1Repository } from './v1/repository/company.v1.repository';
import { UserEntity } from '../entities';
import { ServiceEntity } from '../entities/service.entity';
import { UserServiceOperationEntity } from '../entities/user-service-operation.entity';
import { KeyEntity } from '../entities/key.entity';

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
  controllers: [CompanyV1Controller],
  providers: [CompanyV1Service, CompanyV1Repository],
  exports: [CompanyV1Service],
})
export class CompanyModule {}
