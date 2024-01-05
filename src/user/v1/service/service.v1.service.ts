import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserV1Repository } from './../repository/user.v1.repository';
import { V1KeyDto, V1UserServiceDto } from './../dto/user.v1.dto';
import { KeyManagementServiceClient } from '@google-cloud/kms';
import { GcpHsmSignerUtil } from '../../../util/gcp-hsm-signer.util';
import { GcpHsmKeyUtil } from '../../../util/gcp-hsm-key.util';
import { KeyEntity } from '../../../entities/key.entity';
import { UserHttpStatus } from '../../../enum/user.enum';
import { ServiceEntity } from '../../../entities/service.entity';
import { GoogleOptionDto } from './../dto/key.v1.dto';
import { UserServiceOperationEntity } from '../../../entities/user-service-operation.entity';
import { BadRequestException } from '../../../exception/bad-request.exception';
import { UserV1Service } from '../user.v1.service';
import { ServiceV1Repository } from '../repository/service.v1.repository';

export type User = any;

@Injectable()
export class ServiceV1Service {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService,
    private readonly userService: UserV1Service,
    private readonly userRepo: UserV1Repository,
    private readonly serviceRepo: ServiceV1Repository,
  ) {}

  async getServices(request, query): Promise<any> {
    const user = await this.userService.getUser(request.user.id);
    if (user) {
      const services = await this.serviceRepo.getServices(
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
    const user = await this.userService.getUser(request.user.id);
    if (user) {
      const keyData = await this.serviceRepo.getKeys(
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

  async registerUserService(
    request,
    requestDto: V1UserServiceDto,
  ): Promise<any> {
    try {
      const user = await this.userService.getUser(request.user.id);

      let service = await this.serviceRepo.getService(
        user.userNo,
        requestDto.serviceid,
      );

      if (!service) {
        service = await this.serviceRepo.registerService(<ServiceEntity>{
          userNo: user.userNo,
          serviceId: requestDto.serviceid,
        });
      }

      if (!!requestDto.keys) {
        if (requestDto.keys.length > 0) {
          requestDto.keys.map(async (key) => {
            await this.registerKey(service.userNo, service.serviceNo, key);
          });
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async registerKey(
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

      const key = await this.serviceRepo.registerKey(<KeyEntity>{
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

      await this.serviceRepo.registerUserServiceOperation(<
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
    const user = await this.userService.getUser(reqeust.user.id);
    if (user) {
      const operatorData =
        await this.serviceRepo.getServicesAndOperation(serviceId);
      return {
        operators: operatorData,
      };
    }
    return null;
  }
}
