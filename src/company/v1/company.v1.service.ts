import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CompanyV1Repository } from './repository/company.v1.repository';
import { BadRequestException } from '../../exception/bad-request.exception';
import { Role, UserHttpStatus } from '../../enum/user.enum';
import {
  customUuid,
  generateSecretKey,
  hashData,
  randomString,
} from '../../util/common.util';
import { UserEntity } from '../../entities';
import { ServiceEntity } from '../../entities/service.entity';

export type User = any;

@Injectable()
export class CompanyV1Service {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly companyRepo: CompanyV1Repository,
    private configService: ConfigService,
  ) {}

  /**
   * user 정보 등록
   * @param company
   * @param gameId
   * @param appid
   * @param role
   */
  async createCompanyUser(
    company: number,
    gameId: string,
    appid: string,
    role: Role,
  ): Promise<any> {
    /** 인증키 생성 */
    const secretKey = generateSecretKey();

    /** 인증키 암호화 */
    const hashedApiKey = await hashData(secretKey);
    /** 데이터 삽입 */
    const user = await this.companyRepo.createCompanyUser(<UserEntity>{
      company: company,
      id: gameId,
      secretKeyPlainText: secretKey,
      secretKey: hashedApiKey,
      role: role,
    });

    /** user 등록이 실패할 경우 */
    if (!user) {
      throw new BadRequestException(
        'create failed company user',
        UserHttpStatus.InternalServerError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return user;
  }

  /**
   * service 정보 등록
   * @param userNo
   * @param appid
   */
  async createCompanyUserService(userNo: number, appid: string): Promise<any> {
    try {
      await this.companyRepo.createCompanyUserService(<ServiceEntity>{
        userNo: userNo,
        serviceId: appid,
      });
    } catch (e) {
      throw new BadRequestException(
        'create failed company service',
        UserHttpStatus.InternalServerError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 해당 회사의 gameId 로 등록된 정보 조회
   * @param company
   * @param gameId
   */
  async findCompanyUser(company: number, gameId: string): Promise<any> {
    const user = await this.companyRepo.getUserByCompany(company, gameId);
    if (!user) {
      throw new BadRequestException(
        'user not found',
        UserHttpStatus.UserNotFound,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      userNo: user.userNo,
      serviceId: user.id,
      secretKey: user.secretKeyPlainText,
    };
  }

  /**
   * appid 가 service 테이블에 등록되어 있는지 확인
   * @param userNo
   * @param appId
   */
  async chkCompanyService(userNo: number, appId: string): Promise<boolean> {
    const count = await this.companyRepo.getServiceByCompanyCount(
      userNo,
      appId,
    );
    return count !== 0;
  }
}
