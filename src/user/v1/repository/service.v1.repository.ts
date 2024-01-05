import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserServiceOperationEntity } from '../../../entities/user-service-operation.entity';
import { ServiceEntity } from '../../../entities/service.entity';
import { OperationType } from '../../../enum/key.enum';
import { KeyEntity } from '../../../entities/key.entity';

@Injectable()
export class ServiceV1Repository {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(UserServiceOperationEntity)
    private readonly userServiceOperationRepo: Repository<UserServiceOperationEntity>,
    @InjectRepository(KeyEntity)
    private readonly keyRepo: Repository<KeyEntity>,
  ) {}

  // Service
  async registerService(entity: ServiceEntity) {
    return await this.serviceRepo.save(entity);
  }

  async getService(userNo: number, serviceId: string) {
    return await this.serviceRepo
      .createQueryBuilder('s')
      .where('s.service_id = :serviceId', { serviceId: serviceId })
      .andWhere('s.user_no = :userNo', { userNo: userNo })
      .getOne();
  }

  async getServices(userNo: number, serviceId?: string) {
    return await this.serviceRepo
      .createQueryBuilder('s')
      .where('s.user_no = :userNo', { userNo: userNo })
      .andWhere(serviceId ? 's.service_id = :serviceId' : '1=1', {
        serviceId: serviceId,
      })
      .getMany();
  }

  // User Service Operation
  async registerUserServiceOperation(entity: UserServiceOperationEntity) {
    return await this.userServiceOperationRepo.save(entity);
  }

  async getKeys(
    userNo: number,
    serviceId: string,
    opertionType?: OperationType,
  ) {
    return await this.userServiceOperationRepo
      .createQueryBuilder('uso')
      .select([
        's.service_id as serviceId',
        'k.network as network',
        'uso.operation_type as operationType',
        'k.address as address',
        'k.cloud_type as cloudType',
        'k.key_options as keyOption',
      ])
      .innerJoin(
        'tb_service',
        's',
        'uso.user_no = s.user_no and uso.service_no = s.service_no',
      )
      .innerJoin('tb_key', 'k', 'uso.key_no = k.key_no')
      .where('uso.user_no = :userNo', { userNo: userNo })
      .andWhere('s.service_id = :serviceId', {
        serviceId: serviceId,
      })
      .andWhere(opertionType ? 'uso.operation_type = :operationType' : '1=1', {
        operationType: opertionType,
      })
      .getRawMany();
  }

  async getServicesAndOperation(serviceId: string) {
    return await this.userServiceOperationRepo
      .createQueryBuilder('uso')
      .select([
        's.service_id as serviceId',
        'k.network as network',
        'k.address as address',
        'uso.operation_type as operationType',
        'k.created_at as createdAt',
      ])
      .innerJoin(
        'tb_service',
        's',
        'uso.user_no = s.user_no and uso.service_no = s.service_no',
      )
      .innerJoin('tb_key', 'k', 'uso.key_no = k.key_no')
      .where('s.service_id = :serviceId', {
        serviceId: serviceId,
      })
      .getRawMany();
  }

  // Key
  async registerKey(entity: KeyEntity) {
    return await this.keyRepo.save(entity);
  }
}
