import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import {
  CredentialsReqDto,
  UpdateCredentialsReqDto,
} from '../dto/credentials.v1.dto';
import { CredentialsV1Repository } from '../repository/credentials.v1.repository';
import { BadRequestException } from '../../../exception/bad-request.exception';
import { CredentialsEntity } from '../../../entities/credentials.entity';
import { UserV1Repository } from '../repository/user.v1.repository';
import { customUuid, encrypt } from '../../../util/common.util';
import { CredentialsClientV1 } from './credentials-client.v1';

export class CredentialsV1Service {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService,
    private readonly credentialsRepo: CredentialsV1Repository,
    private readonly userRepo: UserV1Repository,
  ) {}

  async registerCredentials(request, reqDto: CredentialsReqDto) {
    // verify credentials
    await this.verifyCredentials(reqDto);

    const credentialId = customUuid();
    const credentials =
      await this.credentialsRepo.getCredentialsByUserIdAndCredentialId(
        request.user.id,
        credentialId,
      );
    if (credentials) {
      throw new BadRequestException(
        'credentials already existed.',
        'CREDENTIALS_EXISTED',
        '400',
      );
    }

    return await this.credentialsRepo.saveCredentials(<CredentialsEntity>{
      credentialId: credentialId,
      userNo: request.user.number,
      cloudType: reqDto.cloudType,
      credentials: encrypt(
        JSON.stringify(reqDto.credentials),
        this.configService.get('CRYPTO_SECRET_PASSPHRASE'),
      ),
      description: reqDto.description,
    });
  }

  async deleteCredentials(request, credentialId: string) {
    const credentials =
      await this.credentialsRepo.getCredentialsByUserIdAndCredentialId(
        request.user.id,
        credentialId,
      );

    if (!credentials) {
      throw new BadRequestException(
        'credentials not existed',
        'NOT_EXISTED',
        '400',
      );
    }

    // todo: check to delete related keys

    await this.credentialsRepo.deleteCredentials(credentialId);
  }

  async getCredentials(request, credentialId: string) {
    return await this.credentialsRepo.getCredentialsByUserIdAndCredentialId(
      request.user.id,
      credentialId,
    );
  }

  async getCredentialsAll(request, credentialId: string) {
    return await this.credentialsRepo.getCredentialsAll(
      request.user.id,
      credentialId,
    );
  }

  async updateCredentials(
    request,
    credentialId: string,
    reqDto: UpdateCredentialsReqDto,
  ) {
    // verify credentials
    await this.verifyCredentials(reqDto);

    const credentials =
      await this.credentialsRepo.getCredentialsByUserIdAndCredentialId(
        request.user.id,
        credentialId,
      );
    if (!credentials) {
      throw new BadRequestException(
        'credentials not existed',
        'NOT_EXISTED',
        '400',
      );
    }

    await this.credentialsRepo.udpateCredentials(<CredentialsEntity>{
      credentialNo: credentials.credentialNo,
      credentialId: credentialId,
      cloudType: reqDto.cloudType,
      credentials: encrypt(
        JSON.stringify(reqDto.credentials),
        this.configService.get('CRYPTO_SECRET_PASSPHRASE'),
      ),
      description: reqDto.description,
    });
  }

  private async verifyCredentials(
    reqDto: CredentialsReqDto | UpdateCredentialsReqDto,
  ) {
    const client = new CredentialsClientV1({
      cloudType: reqDto.cloudType,
      accessKeyId: reqDto.credentials.accessKeyId,
      accessKeySecret: reqDto.credentials.accessKeySecret,
      location: reqDto.credentials.location,
    });

    try {
      await client.client.verifyCredentials();
    } catch (e) {
      throw new BadRequestException(
        'invalid credentials requested. please check your credentials.',
        'INVALID_CREDENTIALS',
        400,
      );
    }
  }
}
