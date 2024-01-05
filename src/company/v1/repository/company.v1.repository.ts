import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../entities';
import { UserServiceOperationEntity } from '../../../entities/user-service-operation.entity';
import { ServiceEntity } from '../../../entities/service.entity';
import { KeyEntity } from '../../../entities/key.entity';
import { OperationType } from '../../../enum/key.enum';

@Injectable()
export class CompanyV1Repository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(UserServiceOperationEntity)
    private readonly userServiceOperationRepo: Repository<UserServiceOperationEntity>,
    @InjectRepository(KeyEntity)
    private readonly keyRepo: Repository<KeyEntity>,
  ) {}

  /**
   * user 테이블 삽입
   * @param entity
   */
  async createCompanyUser(entity: UserEntity) {
    return await this.userRepo.save(entity);
  }

  /**
   * service 테이블 삽입
   * @param entity
   */
  async createCompanyUserService(entity: ServiceEntity) {
    return await this.serviceRepo.save(entity);
  }

  /**
   * user 테이블에 gameid 가 등록되어 있는지 확인.
   * @param company
   * @param gameId
   */
  async getUserByCompanyCount(
    company: number,
    gameId: string,
  ): Promise<number> {
    return await this.userRepo
      .createQueryBuilder()
      .where('company = :company', { company: company })
      .andWhere('id = :id', { id: gameId })
      .getCount();
  }

  /**
   * serivce 테이블에 appid가 등록되어 있는지 확인.
   * @param userNo
   * @param appId
   */
  async getServiceByCompanyCount(
    userNo: number,
    appId: string,
  ): Promise<number> {
    return await this.serviceRepo
      .createQueryBuilder()
      .where('service_id = :appId', { appId: appId })
      .andWhere('user_no = :userNo', { userNo: userNo })
      .getCount();
  }

  /**
   * user 정보 조회
   * @param company
   * @param gameId
   */
  async getUserByCompany(company: number, gameId: string): Promise<UserEntity> {
    return await this.userRepo
      .createQueryBuilder()
      .where('company = :company', { company: company })
      .andWhere('id = :id', { id: gameId })
      .getOne();
  }

  /**
   * service 정보 조회
   * @param userNo
   * @param appId
   */
  async getServiceByCompany(
    userNo: number,
    appId: string,
  ): Promise<ServiceEntity> {
    return await this.serviceRepo
      .createQueryBuilder()
      .where('service_id = :appId', { appId: appId })
      .andWhere('user_no = :userNo', { userNo: userNo })
      .getOne();
  }
}
