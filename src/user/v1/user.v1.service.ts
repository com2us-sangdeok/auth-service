import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserEntity } from '../../entities';
import { UserV1Repository } from './repository/user.v1.repository';
import {
  V1KeyDto,
  V1RegistUserDto,
  V1UpdateApiKeyDto,
  UserV1Dto,
  V1UserServiceDto,
} from './dto/user.v1.dto';
import { argonVerify, hashData, randomString } from '../../util/common.util';
import { KeyManagementServiceClient } from '@google-cloud/kms';
import { GcpHsmSignerUtil } from '../../util/gcp-hsm-signer.util';
import { GcpHsmKeyUtil } from '../../util/gcp-hsm-key.util';
import { KeyEntity } from '../../entities/key.entity';
import { UserHttpStatus } from '../../enum/user.enum';
import { ServiceEntity } from '../../entities/service.entity';
import { GoogleOptionDto } from './dto/key.v1.dto';
import { UserServiceOperationEntity } from '../../entities/user-service-operation.entity';
import { BadRequestException } from '../../exception/bad-request.exception';
import { ForbiddenException } from '../../exception/forbidden.exception';

export type User = any;

@Injectable()
export class UserV1Service {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService,
    private readonly userRepo: UserV1Repository,
  ) {}

  async create(requestDto: V1RegistUserDto): Promise<any> {
    return await this.userRepo.registerUser(<UserEntity>{
      id: requestDto.id,
      secretKey: requestDto.secretKey,
      role: requestDto.role,
    });
  }

  async getUser(id: string): Promise<UserEntity> {
    const user = await this.userRepo.getUserById(id);
    if (!user) {
      throw new BadRequestException(
        'user not found',
        UserHttpStatus.UserNotFound,
        HttpStatus.NO_CONTENT,
      );
    }
    return user;
  }

  async getUserWithoutSecretKey(request): Promise<any> {
    const user = await this.getUser(request.user.id);

    if (user) {
      const { secretKey, refreshToken, updatedAt, ...result } = user;
      return {
        ...result,
      };
    }
    return null;
  }

  async getServices(request, query): Promise<any> {
    const user = await this.getUser(request.user.id);
    if (user) {
      const services = await this.userRepo.getServices(
        user.userNo,
        query.serviceId,
      );
      if (services.length > 0) {
        return {
          id: user.id,
          service: services.map((service) => service.serviceId),
        };
      }
    }
    return null;
  }

  async getKeys(request, query, serviceId: string): Promise<any> {
    const user = await this.getUser(request.user.id);
    if (user) {
      const keyData = await this.userRepo.getKeys(
        user.userNo,
        serviceId,
        query.operationType,
      );
      if (keyData.length > 0) {
        return {
          id: user.id,
          serviceId: keyData[0]?.serviceId,
          keys: keyData.map(({ serviceId, ...rest }) => rest),
        };
      }
    }
    return null;
  }

  async updateSecretKey(request, reqDto: V1UpdateApiKeyDto) {
    const user = await this.getUser(request.user.id);

    const isMatched = await argonVerify(user.secretKey, reqDto.secretKey);
    if (!isMatched) {
      throw new ForbiddenException();
    }

    const secretKey = randomString(32, 'base64');
    const hashedApiKey = await hashData(secretKey);
    await this.userRepo.updateSecretKey(<UserEntity>{
      id: reqDto.id,
      secretKey: hashedApiKey,
    });

    return {
      secretKey: secretKey,
    };
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    await this.userRepo.updateRefreshToken(<UserEntity>{
      id: id,
      refreshToken: refreshToken,
    });
  }

  async registUser(requestDto: UserV1Dto): Promise<any> {
    const secretKey = randomString(32, 'base64');
    const hashedApiKey = await hashData(secretKey);

    try {
      await this.userRepo.registerUser(<UserEntity>{
        id: requestDto.id,
        secretKey: hashedApiKey,
        role: requestDto.role,
        tenantId: requestDto.tenantId,
      });

      return {
        secretKey: secretKey,
      };
    } catch (e) {
      if (e.errno === 1062) {
        throw new BadRequestException(
          'user already existed',
          UserHttpStatus.UserExisted,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw e;
      }
    }
  }

  async registUserService(request, requestDto: V1UserServiceDto): Promise<any> {
    try {
      const user = await this.getUser(request.user.id);

      let service = await this.userRepo.getService(
        user.userNo,
        requestDto.serviceid,
      );

      if (!service) {
        service = await this.userRepo.registerService(<ServiceEntity>{
          userNo: user.userNo,
          serviceId: requestDto.serviceid,
        });
      }

      if (!!requestDto.keys) {
        if (requestDto.keys.length > 0) {
          requestDto.keys.map(async (key) => {
            await this.registKey(service.userNo, service.serviceNo, key);
          });
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async registKey(
    userNo: number,
    serviceNo: number,
    requestDto: V1KeyDto,
  ): Promise<any> {
    const kms = new KeyManagementServiceClient({
      keyFile: this.configService.get('AUTH_KEY_PATH'),
    });

    try {
      // todo: add AWS, AZURE process
      const cryptoKey = kms.cryptoKeyVersionPath(
        requestDto.project,
        requestDto.location,
        requestDto.keyRing,
        requestDto.cryptoKey,
        requestDto.cryptoKeyVersion,
      );

      const hsmSigner = new GcpHsmSignerUtil(kms, cryptoKey);
      const pubKey = await hsmSigner.getPublicKey();
      const hsmKey = new GcpHsmKeyUtil(hsmSigner, pubKey);

      const key = await this.userRepo.registerKey(<KeyEntity>{
        network: requestDto.network,
        address: hsmKey.accAddress,
        cloudType: requestDto.cloudType,
        keyOptions: <GoogleOptionDto>{
          project: requestDto.project,
          location: requestDto.location,
          keyRing: requestDto.keyRing,
          cryptoKey: requestDto.cryptoKey,
          cryptoKeyVersion: requestDto.cryptoKeyVersion,
        },
      });

      await this.userRepo.registerUserServiceOperation(<
        UserServiceOperationEntity
      >{
        userNo: userNo,
        serviceNo: serviceNo,
        keyNo: key.keyNo,
        operationType: requestDto.operationType,
      });
    } catch (e) {
      if (e.errno === 1062) {
        throw new BadRequestException(
          'key existed',
          UserHttpStatus.KeyExisted,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw e;
      }
    }
  }

  async getServicesAndOperation(reqeust, serviceId: string) {
    const user = await this.getUser(reqeust.user.id);
    if (user) {
      const operatorData = await this.userRepo.getServicesAndOperation(
        serviceId,
      );
      return {
        operators: operatorData,
      };
    }
    return null;
  }
}
